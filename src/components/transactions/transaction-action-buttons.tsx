import React from "react";
import { View, Alert } from "react-native";
import { Button } from "../../components/ui/button";

interface TransactionActionButtonsProps {
  isEditing: boolean;
  onSave: (addAnother: boolean) => void;
  onSaveTemplate: () => void;
  onDelete?: () => void;
}

export function TransactionActionButtons({
  isEditing,
  onSave,
  onSaveTemplate,
  onDelete,
}: TransactionActionButtonsProps) {
  return (
    <View>
      <Button
        title={isEditing ? "Save Changes" : "Save Transaction"}
        onPress={() => onSave(false)}
        className="mb-4 mt-4"
      />

      {!isEditing && (
        <>
          <Button
            title="Save & Add Another"
            onPress={() => onSave(true)}
            variant="secondary"
            className="mb-4"
          />
          <Button
            title="Save as Quick Template"
            onPress={onSaveTemplate}
            variant="ghost"
            className="mb-4"
          />
        </>
      )}

      {isEditing && onDelete && (
        <Button
          title="Delete Transaction"
          variant="danger"
          onPress={onDelete}
          className="mb-8"
        />
      )}
    </View>
  );
}
