import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";
import * as XLSX from "xlsx";
import * as Clipboard from "expo-clipboard";
import { Expense, Account, Category } from "../database/schema";
import { Platform } from "react-native";

export type ExportColumn =
  | "Date"
  | "Time"
  | "Type"
  | "Category"
  | "Amount"
  | "Description"
  | "Merchant"
  | "Account"
  | "AccountInitialBalance";

export const exportData = async (
  expenses: Expense[],
  accounts: Account[],
  categories: Category[],
  format: "csv" | "xlsx",
  action: "save" | "share" = "share",
  savedDirectoryUri?: string | null,
): Promise<string | undefined> => {
  try {
    const formattedData = expenses.map((e) => {
      const account = accounts.find((a) => a.id === e.accountId);
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        Date: new Date(e.date).toLocaleDateString().replace(/\u202F/g, " "),
        Time: new Date(e.date).toLocaleTimeString().replace(/\u202F/g, " "),
        Type: e.type === "credit" ? "Income" : "Expense",
        Category: category ? category.name : "Unknown",
        Amount: `₹${e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        Description: e.description,
        Merchant: e.merchant || "",
        AccountName: account ? account.name : "Unassigned",
        AccountType: account ? account.type : "N/A",
        AccountInitialBalance: account ? account.balance : 0,
        _RawDateUnix: e.date,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const fileBase64 = XLSX.write(workbook, {
      type: "base64",
      bookType: format,
    });
    const mimeType =
      format === "csv"
        ? "text/csv"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const filename = `LedgerLite_Export_${Date.now()}.${format}`;

    if (action === "save" && Platform.OS === "android") {
      if (savedDirectoryUri) {
        try {
          const safUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              savedDirectoryUri,
              filename,
              mimeType,
            );
          await FileSystem.writeAsStringAsync(safUri, fileBase64, {
            encoding: "base64",
          });
          return savedDirectoryUri;
        } catch (e) {}
      }

      const initialUri =
        "content://com.android.externalstorage.documents/tree/primary%3ADocuments";
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
          initialUri,
        );

      if (permissions.granted) {
        let targetDirUri = permissions.directoryUri;

        if (!decodeURIComponent(targetDirUri).endsWith("LedgerLite")) {
          let folderCreatedOrFound = false;

          try {
            const files =
              await FileSystem.StorageAccessFramework.readDirectoryAsync(
                permissions.directoryUri,
              );
            const existingLedgerLite = files.find(
              (f) =>
                decodeURIComponent(f).endsWith("/LedgerLite") ||
                decodeURIComponent(f).endsWith(":LedgerLite"),
            );
            if (existingLedgerLite) {
              targetDirUri = existingLedgerLite;
              folderCreatedOrFound = true;
            }
          } catch (e) {}

          if (!folderCreatedOrFound) {
            try {
              targetDirUri =
                await FileSystem.StorageAccessFramework.makeDirectoryAsync(
                  permissions.directoryUri,
                  "LedgerLite",
                );
            } catch (e) {}
          }
        }

        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
          targetDirUri,
          filename,
          mimeType,
        );
        await FileSystem.writeAsStringAsync(safUri, fileBase64, {
          encoding: "base64",
        });
        return targetDirUri;
      }
    }

    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, fileBase64, {
      encoding: "base64",
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: mimeType,
      dialogTitle: "Export LedgerLite Data",
    });

    return undefined;
  } catch (error) {
    console.error("Export Error: ", error);
    return undefined;
  }
};

const getRowValue = (row: any, keys: string[]): any => {
  if (!row) return undefined;
  const rowKeys = Object.keys(row);
  for (const k of keys) {
    if (row[k] !== undefined) return row[k];
    const matchedKey = rowKeys.find(
      (rk) => rk.toLowerCase().trim() === k.toLowerCase().trim()
    );
    if (matchedKey !== undefined) return row[matchedKey];
  }
  return undefined;
};

const getSystemDateFormat = (): "MDY" | "DMY" | "YMD" => {
  const testDate = new Date(2026, 11, 25);
  const formatted = testDate.toLocaleDateString();
  if (formatted.startsWith("2026")) return "YMD";
  if (formatted.startsWith("25")) return "DMY";
  return "MDY";
};

export const parseTimeString = (timeStr: string) => {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  const timeParts = timeStr.trim().match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i
  );
  if (timeParts) {
    hours = parseInt(timeParts[1]);
    minutes = parseInt(timeParts[2]);
    seconds = timeParts[3] ? parseInt(timeParts[3]) : 0;
    const ampm = timeParts[4] ? timeParts[4].toUpperCase() : "";
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  }

  return { hours, minutes, seconds };
};

export const parseDateTime = (dateVal: any, timeVal: any): number => {
  if (!dateVal) return Date.now();
  if (typeof dateVal === "number" && dateVal > 100000000) {
    return dateVal < 10000000000 ? dateVal * 1000 : dateVal;
  }

  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  let day = new Date().getDate();
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  let activeTimeVal = timeVal;

  if (dateVal instanceof Date) {
    year = dateVal.getUTCFullYear();
    month = dateVal.getUTCMonth();
    day = dateVal.getUTCDate();
    hours = dateVal.getUTCHours();
    minutes = dateVal.getUTCMinutes();
    seconds = dateVal.getUTCSeconds();
  } else if (typeof dateVal === "number" && dateVal > 25569) {
    const datePart = Math.floor(dateVal);
    const timePart = dateVal - datePart;

    const dateObj = new Date((datePart - 25569) * 86400 * 1000);
    year = dateObj.getUTCFullYear();
    month = dateObj.getUTCMonth();
    day = dateObj.getUTCDate();

    if (timePart > 0) {
      const totalSeconds = Math.round(timePart * 86400);
      hours = Math.floor(totalSeconds / 3600);
      minutes = Math.floor((totalSeconds % 3600) / 60);
      seconds = totalSeconds % 60;
    }
  } else {
    const dateStr = String(dateVal).trim();
    const timeMatch = dateStr.match(/(?:\s+|T)(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (!activeTimeVal && timeMatch) {
      activeTimeVal = timeMatch[0].trim();
    }

    const ymdMatch = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    const dmyMatch = dateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);

    if (ymdMatch) {
      year = parseInt(ymdMatch[1]);
      month = parseInt(ymdMatch[2]) - 1;
      day = parseInt(ymdMatch[3]);
    } else if (dmyMatch) {
      const p1 = parseInt(dmyMatch[1]);
      const p2 = parseInt(dmyMatch[2]);
      const p3 = parseInt(dmyMatch[3]);

      if (p1 > 12) {
        day = p1;
        month = p2 - 1;
      } else if (p2 > 12) {
        month = p1 - 1;
        day = p2;
      } else {
        const format = getSystemDateFormat();
        if (format === "MDY") {
          month = p1 - 1;
          day = p2;
        } else {
          day = p1;
          month = p2 - 1;
        }
      }
      year = p3;
    } else {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        if (dateStr.includes("T") || dateStr.includes("Z") || dateStr.includes("GMT")) {
          year = parsed.getUTCFullYear();
          month = parsed.getUTCMonth();
          day = parsed.getUTCDate();
          hours = parsed.getUTCHours();
          minutes = parsed.getUTCMinutes();
          seconds = parsed.getUTCSeconds();
        } else {
          year = parsed.getFullYear();
          month = parsed.getMonth();
          day = parsed.getDate();
          hours = parsed.getHours();
          minutes = parsed.getMinutes();
          seconds = parsed.getSeconds();
        }
      }
    }
  }

  if (activeTimeVal) {
    if (typeof activeTimeVal === "number" && activeTimeVal >= 0 && activeTimeVal < 1) {
      const totalSeconds = Math.round(activeTimeVal * 86400);
      hours = Math.floor(totalSeconds / 3600);
      minutes = Math.floor((totalSeconds % 3600) / 60);
      seconds = totalSeconds % 60;
    } else if (activeTimeVal instanceof Date) {
      hours = activeTimeVal.getUTCHours();
      minutes = activeTimeVal.getUTCMinutes();
      seconds = activeTimeVal.getUTCSeconds();
    } else {
      const dateParsed = new Date(activeTimeVal);
      const activeStr = String(activeTimeVal);
      if (!isNaN(dateParsed.getTime()) && (activeStr.includes("T") || activeStr.includes("GMT") || activeStr.includes("Z"))) {
        hours = dateParsed.getUTCHours();
        minutes = dateParsed.getUTCMinutes();
        seconds = dateParsed.getUTCSeconds();
      } else {
        const parsedTime = parseTimeString(activeStr);
        hours = parsedTime.hours;
        minutes = parsedTime.minutes;
        seconds = parsedTime.seconds;
      }
    }
  }

  return new Date(year, month, day, hours, minutes, seconds).getTime();
};

export const importData = async (
  categories: Category[],
  accounts: Account[],
  existingExpenses: Expense[],
): Promise<{
  expenses: any[];
  missingAccounts: { name: string; initialBalance: number }[];
} | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "text/csv",
        "text/comma-separated-values",
        "application/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const fileUri = result.assets[0].uri;
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "base64",
    });
    const workbook = XLSX.read(fileBase64, { type: "base64", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rawJson = XLSX.utils.sheet_to_json(worksheet) as any[];

    const importedExpenses: any[] = [];
    const missingAccounts: { name: string; initialBalance: number }[] = [];
    const pairedIds = new Set<string>();

    for (const row of rawJson) {
      const amountVal = getRowValue(row, ["Amount", "amount", "value", "sum"]);
      const rawAmountStr = String(amountVal || "0").replace(/[^0-9.-]+/g, "");
      const parsedAmount = parseFloat(rawAmountStr) || 0;

      const categoryName = getRowValue(row, ["Category", "category", "group"]);
      const matchedCategory = categories.find((c) => c.name === categoryName);
      const categoryId = matchedCategory ? matchedCategory.id : "cat-1";

      const accountName = getRowValue(row, ["AccountName", "Account", "account_name", "accountName", "account"]);
      const matchedAccount = accounts.find((a) => a.name === accountName);
      const accountId = matchedAccount ? matchedAccount.id : undefined;

      if (!matchedAccount && accountName && accountName !== "Unassigned") {
        if (!missingAccounts.find((m) => m.name === accountName)) {
          const balanceVal = getRowValue(row, ["AccountInitialBalance", "initial_balance", "initialBalance", "balance"]);
          const initialBalance =
            parseFloat(
              String(balanceVal || "0").replace(/[^0-9.-]+/g, ""),
            ) || 0;
          missingAccounts.push({ name: accountName, initialBalance });
        }
      }

      const dateVal = getRowValue(row, ["Date", "date", "date_time", "datetime", "timestamp"]);
      const timeVal = getRowValue(row, ["Time", "time"]);
      const rawUnixVal = getRowValue(row, ["_RawDateUnix", "raw_date_unix", "rawDateUnix"]);
      let parsedDate = Date.now();

      if (dateVal) {
        parsedDate = parseDateTime(dateVal, timeVal);
      } else if (rawUnixVal) {
        parsedDate = parseInt(String(rawUnixVal));
      }

      const typeVal = getRowValue(row, ["Type", "type", "transaction_type", "transactionType"]);
      const type =
        typeVal === "Income" || typeVal === "credit" || typeVal === "income" ? "credit" : "debit";

      const descVal = getRowValue(row, ["Description", "description", "details", "memo", "note"]);
      const description = descVal || "Imported Transaction";

      const merchantVal = getRowValue(row, ["Merchant", "merchant", "payee", "shop"]);

      const matchedExisting = existingExpenses.find((ex) => {
        if (pairedIds.has(ex.id)) return false;
        const timeDiff = Math.abs(ex.date - parsedDate);
        return (
          ex.amount === parsedAmount &&
          ex.description === description &&
          ex.type === type &&
          timeDiff < 60000
        );
      });

      if (matchedExisting) {
        pairedIds.add(matchedExisting.id);
      } else {
        importedExpenses.push({
          id: String(Date.now() + Math.random()),
          amount: parsedAmount,
          description,
          merchant: merchantVal || null,
          date: parsedDate,
          type,
          categoryId,
          accountId,
          _accountName: accountName,
        });
      }
    }

    return { expenses: importedExpenses, missingAccounts };
  } catch (error) {
    console.error("Import Error: ", error);
    return null;
  }
};

export const exportSettingsJSON = async (
  settingsData: any,
  action: "save" | "share" | "copy" = "share",
  savedDirectoryUri?: string | null,
): Promise<string | undefined> => {
  try {
    const jsonString = JSON.stringify(settingsData, null, 2);

    if (action === "copy") {
      await Clipboard.setStringAsync(jsonString);
      return undefined;
    }

    const filename = `LedgerLite_Settings_${Date.now()}.json`;
    const mimeType = "application/json";

    if (action === "save" && Platform.OS === "android") {
      if (savedDirectoryUri) {
        try {
          const safUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              savedDirectoryUri,
              filename,
              mimeType,
            );
          await FileSystem.writeAsStringAsync(safUri, jsonString, {
            encoding: "utf8",
          });
          return savedDirectoryUri;
        } catch (e) {}
      }

      const initialUri =
        "content://com.android.externalstorage.documents/tree/primary%3ADocuments";
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
          initialUri,
        );

      if (permissions.granted) {
        let targetDirUri = permissions.directoryUri;
        if (!decodeURIComponent(targetDirUri).endsWith("LedgerLite")) {
          let folderCreatedOrFound = false;
          try {
            const files =
              await FileSystem.StorageAccessFramework.readDirectoryAsync(
                permissions.directoryUri,
              );
            const existingLedgerLite = files.find(
              (f) =>
                decodeURIComponent(f).endsWith("/LedgerLite") ||
                decodeURIComponent(f).endsWith(":LedgerLite"),
            );
            if (existingLedgerLite) {
              targetDirUri = existingLedgerLite;
              folderCreatedOrFound = true;
            }
          } catch (e) {}
          if (!folderCreatedOrFound) {
            try {
              targetDirUri =
                await FileSystem.StorageAccessFramework.makeDirectoryAsync(
                  permissions.directoryUri,
                  "LedgerLite",
                );
            } catch (e) {}
          }
        }

        const safUri = await FileSystem.StorageAccessFramework.createFileAsync(
          targetDirUri,
          filename,
          mimeType,
        );
        await FileSystem.writeAsStringAsync(safUri, jsonString, {
          encoding: "utf8",
        });
        return targetDirUri;
      }
    }

    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: "utf8",
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: mimeType,
      dialogTitle: "Export LedgerLite Settings",
    });

    return undefined;
  } catch (error) {
    console.error("Settings Export Error: ", error);
    return undefined;
  }
};
export const importSettingsJSON = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: "utf8",
    });
    const parsedData = JSON.parse(fileContent);
    return parsedData;
  } catch (error) {
    console.error("Settings Import Error: ", error);
    return null;
  }
};

export const exportToPDF = async (
  expenses: Expense[],
  accounts: Account[],
  categories: Category[],
  selectedColumns: ExportColumn[],
  startDate: Date,
  endDate: Date,
  includePieChart: boolean,
  action: "save" | "share" = "share",
  savedDirectoryUri?: string | null,
): Promise<string | undefined> => {
  try {
    const escapeHTML = (str: any) => {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const formattedData = expenses.map((e) => {
      const account = accounts.find((a) => a.id === e.accountId);
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        Date: new Date(e.date).toLocaleDateString().replace(/\u202F/g, " "),
        Time: new Date(e.date).toLocaleTimeString().replace(/\u202F/g, " "),
        Type: e.type === "credit" ? "Income" : "Expense",
        Category: category ? category.name : "Unknown",
        Amount: `₹${e.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        Description: e.description,
        Merchant: e.merchant || "",
        Account: account ? account.name : "Unassigned",
        AccountInitialBalance: account ? account.balance : 0,
      };
    });

    const thHeaders = selectedColumns
      .map((col) => `<th>${escapeHTML(col)}</th>`)
      .join("");
    const trRows = formattedData
      .map((row) => {
        const tdCells = selectedColumns
          .map((col) => `<td>${escapeHTML((row as any)[col])}</td>`)
          .join("");
        return `<tr>${tdCells}</tr>`;
      })
      .join("");

    let pieChartHtml = "";
    if (includePieChart) {
      // Ref: dataService-1
      const categoryTotals: Record<string, number> = {};
      let totalDebit = 0;
      expenses.forEach((e) => {
        if (e.type === "debit") {
          const catName = categories.find((c) => c.id === e.categoryId)?.name || "Unknown";
          categoryTotals[catName] = (categoryTotals[catName] || 0) + e.amount;
          totalDebit += e.amount;
        }
      });

      if (totalDebit > 0) {
        // Ref: dataService-2
        const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1"];
        let cumulativePercentage = 0;
        const gradientStops: string[] = [];
        const legendItems: string[] = [];
        let colorIndex = 0;

        Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).forEach(([name, amount]) => {
          const percentage = (amount / totalDebit) * 100;
          const color = colors[colorIndex % colors.length];
          gradientStops.push(`${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
          legendItems.push(`
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${color};"></div>
              <span>${escapeHTML(name)} (₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })})</span>
            </div>
          `);
          cumulativePercentage += percentage;
          colorIndex++;
        });

        pieChartHtml = `
          <div class="pie-chart-section">
            <div class="pie-chart" style="background: conic-gradient(${gradientStops.join(", ")});"></div>
            <div class="pie-legend">
              ${legendItems.join("")}
            </div>
          </div>
        `;
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #111; margin-bottom: 5px; }
            h3 { text-align: center; color: #666; margin-top: 0; font-weight: normal; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f4f4f5; color: #111; font-weight: bold; }
            tr:nth-child(even) { background-color: #fafafa; }
            .pie-chart-section { display: flex; align-items: center; justify-content: center; margin: 30px 0; gap: 40px; }
            .pie-chart { width: 250px; height: 250px; border-radius: 50%; border: 1px solid #ddd; }
            .pie-legend { display: flex; flex-direction: column; gap: 8px; }
            .legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
            .legend-color { width: 16px; height: 16px; border-radius: 4px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>LedgerLite Report</h1>
          <h3>Report Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</h3>
          ${pieChartHtml}
          <table>
            <thead><tr>${thHeaders}</tr></thead>
            <tbody>${trRows}</tbody>
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      width: 612, // Ref: dataService-1
      height: 792, // Ref: dataService-2
    });

    // Ref: dataService-3
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const filename = `LedgerLite_Report_${Date.now()}.pdf`;
    const mimeType = "application/pdf";

    if (action === "save" && Platform.OS === "android") {
      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      let targetDirUri = savedDirectoryUri || undefined;

      if (!targetDirUri) {
        const initialUri =
          "content://com.android.externalstorage.documents/tree/primary%3ADocuments";
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
            initialUri,
          );

        if (permissions.granted) {
          targetDirUri = permissions.directoryUri;
          if (!decodeURIComponent(targetDirUri).endsWith("LedgerLite")) {
            let folderCreatedOrFound = false;
            try {
              const files =
                await FileSystem.StorageAccessFramework.readDirectoryAsync(
                  permissions.directoryUri,
                );
              const existingLedgerLite = files.find(
                (f) =>
                  decodeURIComponent(f).endsWith("/LedgerLite") ||
                  decodeURIComponent(f).endsWith(":LedgerLite"),
              );
              if (existingLedgerLite) {
                targetDirUri = existingLedgerLite;
                folderCreatedOrFound = true;
              }
            } catch (e) {}

            if (!folderCreatedOrFound) {
              try {
                targetDirUri =
                  await FileSystem.StorageAccessFramework.makeDirectoryAsync(
                    permissions.directoryUri,
                    "LedgerLite",
                  );
              } catch (e) {}
            }
          }
        }
      }

      if (targetDirUri) {
        try {
          const safUri =
            await FileSystem.StorageAccessFramework.createFileAsync(
              targetDirUri,
              filename,
              mimeType,
            );
          await FileSystem.writeAsStringAsync(safUri, fileBase64, {
            encoding: "base64",
          });
          return targetDirUri;
        } catch (e) {}
      }
    }

    // Ref: dataService-4
    if (action === "share") {
      // Ref: dataService-3
      const documentUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({
        from: uri,
        to: documentUri
      });
      await Sharing.shareAsync(documentUri, { mimeType, dialogTitle: "Export PDF", UTI: "com.adobe.pdf" });
    }
    return undefined;
  } catch (error) {
    console.error("PDF Export Error: ", error);
    return undefined;
  }
};
