import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles/inputstyles";

interface InputProps extends TextInputProps {
  label: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  labelIcon?: React.ReactNode;
  isPassword?: boolean;
  rightLabel?: string;
  onRightLabelPress?: () => void;
}

export default function Input({
  label,
  leftIcon,
  labelIcon,
  isPassword = false,
  rightLabel,
  onRightLabelPress,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {labelIcon && <View style={{ marginRight: 6 }}>{labelIcon}</View>}
          <Text style={styles.label}>
            {label.split("*").map((part, index, array) => (
              <React.Fragment key={index}>
                {part}
                {index < array.length - 1 && <Text style={{ color: "#EF4444" }}>*</Text>}
              </React.Fragment>
            ))}
          </Text>
        </View>
        {rightLabel && (
          <TouchableOpacity onPress={onRightLabelPress}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputContainer}>
        {leftIcon && (
          <Feather name={leftIcon} size={20} color="#6B7280" style={styles.icon} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}