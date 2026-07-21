import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { Paths, File, Directory } from "expo-file-system";
// @ts-ignore
import * as FileSystemLegacy from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { checkForUpdates, UpdateInfo } from "../../server/services/updateService";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";

const markdownStyles = {
  body: { color: "#9ca3af", fontSize: 13, lineHeight: 20 },
  heading2: {
    color: "#10b981",
    fontWeight: "bold" as "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8
  },
  heading3: {
    color: "#a855f7",
    fontWeight: "bold" as "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8
  },
  heading4: {
    color: "#eab308",
    fontWeight: "bold" as "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8
  },
  hr: {
    backgroundColor: '#1b1b1c',
    height: 1,
    marginTop: 12,
    marginBottom: 4
  },
  link: { color: "#10b981" },
  list_item: { marginBottom: 6, flexDirection: 'row' as 'row', alignItems: 'flex-start' as 'flex-start' },
  bullet_list: { marginLeft: 0 },
  bullet_list_icon: {
    color: "#9ca3af",
    fontSize: 14,
    marginRight: 6,
    marginTop: 0
  }
};

export function UpdateChecker() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [visible, setVisible] = useState(false);

  type DownloadStatus =
  "IDLE" |
  "CHECKING" |
  "DOWNLOADING" |
  "READY_TO_INSTALL" |
  "INSTALLING";
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>("IDLE");
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const check = async () => {
      try {
        const currentVersion = Constants.expoConfig?.version || "1.0.0";
        const info = await checkForUpdates(currentVersion);

        if (info.isUpdateAvailable && info.downloadUrl) {
          setUpdateInfo(info);
          setVisible(true);

          setDownloadStatus("CHECKING");
          const apkUri =
          Paths.document.uri +
          `LedgerLite-Update-${info.latestVersion}.apk`;
          const file = new File(apkUri);
          if (file.exists) {
            setDownloadStatus("READY_TO_INSTALL");
          } else {
            setDownloadStatus("IDLE");
          }
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };

    check();
  }, []);

  const installApk = useCallback(
    async (uri: string) => {
      setDownloadStatus("INSTALLING");
      try {
        const contentUri = await FileSystemLegacy.getContentUriAsync(uri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1 | 268435456,
          type: "application/vnd.android.package-archive"
        });
        setVisible(false);
      } catch (error) {
        console.error("Install failed:", error);
        Linking.openURL(updateInfo!.downloadUrl!);
      } finally {
        setDownloadStatus("READY_TO_INSTALL");
      }
    },
    [updateInfo]
  );

  const handleUpdate = useCallback(async () => {
    if (!updateInfo?.downloadUrl) return;

    try {
      const apkUri = Paths.document.uri + `LedgerLite-Update-${updateInfo.latestVersion}.apk`;

      if (downloadStatus === "READY_TO_INSTALL") {
        await installApk(apkUri);
        return;
      }

      setDownloadStatus("DOWNLOADING");
      setDownloadProgress(0);


      const dirContents = new Directory(Paths.document).list();
      for (const item of dirContents) {
        if (item instanceof File && item.name.endsWith('.apk') && item.name !== `LedgerLite-Update-${updateInfo.latestVersion}.apk`) {
          try {item.delete();} catch (e) {}
        }
      }

      const downloadResumable = FileSystemLegacy.createDownloadResumable(
        updateInfo.downloadUrl,
        apkUri,
        {},
        (progress: any) => {
          const percentage = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress(percentage);
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (result?.uri) {
        setDownloadStatus("READY_TO_INSTALL");
        await installApk(result.uri);
      }
    } catch (error) {
      console.error("Failed to download update:", error);
      setDownloadStatus("IDLE");
      Linking.openURL(updateInfo.downloadUrl);
    }
  }, [updateInfo, downloadStatus, installApk]);

  const getButtonText = useCallback(() => {
    switch (downloadStatus) {
      case "CHECKING":
        return "Checking storage...";
      case "DOWNLOADING":
        return `Downloading... ${Math.round(downloadProgress * 100)}%`;
      case "READY_TO_INSTALL":
        return "Install Update";
      case "INSTALLING":
        return "Installing...";
      default:
        return "Download Update";
    }
  }, [downloadStatus, downloadProgress]);

  const isButtonDisabled = useMemo(() => {
    return (
      downloadStatus === "CHECKING" ||
      downloadStatus === "DOWNLOADING" ||
      downloadStatus === "INSTALLING");

  }, [downloadStatus]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!updateInfo) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}>
      
      <View className="flex-1 justify-center items-center bg-black/80 px-6">
        <View className="w-full bg-[#0f1011] border border-[#1b1b1c] rounded-[32px] overflow-hidden shadow-xl pb-6">
          
          <Pressable
            onPress={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 bg-[#1b1b1c] rounded-full items-center justify-center z-10">
            
            <Ionicons name="close" size={18} color="#9ca3af" />
          </Pressable>

          <View className="items-center pt-8 pb-4 relative">
            <View className="relative w-24 h-24 items-center justify-center mb-4">
              <View className="absolute top-2 left-4"><Text className="text-[#10b981] text-xs">✦</Text></View>
              <View className="absolute top-0 right-4"><Text className="text-[#10b981] text-[10px]">✦</Text></View>
              <View className="absolute bottom-6 left-0"><Text className="text-[#10b981] text-[10px]">✦</Text></View>
              <View className="absolute bottom-4 right-0"><Text className="text-[#10b981] text-xs">✦</Text></View>
              
              <View className="w-16 h-16 rounded-full border border-[#10b981]/50 bg-[#10b981]/10 items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Ionicons name="cloud-download-outline" size={30} color="#10b981" />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold text-center">Update Available!</Text>
            <Text className="text-gray-400 text-sm text-center mt-2 px-4">
              Version <Text className="text-[#10b981]">{updateInfo.latestVersion}</Text> is ready to install
            </Text>
          </View>

          {updateInfo.releaseNotes ?
          <View className="px-6 mb-6 max-h-72">
              <View className="bg-[#131415] border border-[#1b1b1c] rounded-2xl overflow-hidden flex-1">
                <View className="flex-row items-center p-4 border-b border-[#1b1b1c]">
                  <Ionicons name="document-text-outline" size={20} color="#10b981" className="mr-3" />
                  <View>
                    <Text className="text-white font-bold text-sm">What's New</Text>
                    <Text className="text-gray-500 text-[11px]">Check out what's been improved</Text>
                  </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} className="px-4 pb-4">
                  <Markdown style={markdownStyles}>
                    {updateInfo.releaseNotes}
                  </Markdown>
                </ScrollView>
              </View>
            </View> :
          null}

          <View className="px-6 pb-6 pt-2 w-full">
            <View className="items-center mb-4">
              <Text className="text-gray-400 text-sm">Download the latest version</Text>
              <Text className="text-gray-500 text-sm mt-1">
                <Text className="text-[#10b981] font-bold">42.3 MB</Text> / 72.1 MB <Text className="mx-1">•</Text> <Text className="text-[#a855f7] font-bold">{downloadStatus === 'DOWNLOADING' ? Math.round(downloadProgress * 100) : 58}%</Text>
              </Text>
            </View>

            <Pressable
              onPress={handleUpdate}
              disabled={isButtonDisabled}
              className="w-full h-14 bg-[#131415] border border-[#1b1b1c] rounded-full overflow-hidden mb-4 justify-center items-center relative active:opacity-80">
              
              <View
                className="absolute left-0 top-0 bottom-0 bg-[#10b981]"
                style={{
                  width:
                  downloadStatus === "IDLE" ||
                  downloadStatus === "READY_TO_INSTALL" ?
                  "100%" :
                  `${downloadStatus === 'DOWNLOADING' ? downloadProgress * 100 : 58}%`,
                  opacity:
                  downloadStatus === "INSTALLING" ||
                  downloadStatus === "CHECKING" ?
                  0.5 :
                  1
                }} />
              
              <View className="flex-row items-center z-10">
                <Ionicons name="download-outline" size={20} color="white" className="mr-2" />
                <Text
                  className="text-white font-bold text-base"
                  style={{
                    textShadowColor: "rgba(0,0,0,0.5)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3
                  }}>
                  
                  {downloadStatus === 'DOWNLOADING' ? getButtonText() : 'Downloading... 58%'}
                </Text>
              </View>
            </Pressable>

            <Text className="text-gray-400 text-[13px] text-center mb-6 leading-5">
              The update will download in the background.{'\n'}You'll be prompted to install when it's ready.
            </Text>

            <Pressable
              onPress={handleDismiss}
              disabled={isButtonDisabled}
              className="w-full h-14 border border-[#a855f7]/50 rounded-full justify-center items-center flex-row active:bg-[#a855f7]/10">
              
              <Ionicons name="time-outline" size={20} color="#a855f7" className="mr-2" />
              <Text className="text-[#a855f7] font-bold text-base">Maybe Later</Text>
            </Pressable>

            <View className="flex-row items-center justify-center mt-6 mb-2">
              <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" className="mr-3" />
              <Text className="text-gray-400 text-xs text-left leading-4">
                This update is safe and secure.{'\n'}Your data is always protected.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>);

}