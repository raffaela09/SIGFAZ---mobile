import { Feather } from "@expo/vector-icons";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import styles from "./styles/buttonstyles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "outline";
  rightIcon?: keyof typeof Feather.glyphMap;
}

export default function Button({
  title,
  variant = "primary",
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.outlineButton,
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.text,
            isPrimary ? styles.primaryText : styles.outlineText,
          ]}
        >
          {title}
        </Text>
        {rightIcon && (
          <Feather
            name={rightIcon}
            size={20}
            color={isPrimary ? "#FFFFFF" : "#22C55E"}
            style={styles.icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}