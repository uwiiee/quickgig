import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  message,
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 24,
            width: "80%",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
            }}
          >
            {message}
          </Text>
          <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#d1d1d1",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#555" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: "#859581",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#fff" }}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
