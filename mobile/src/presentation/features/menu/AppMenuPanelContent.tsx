import { View, Text, Pressable, ScrollView, StyleSheet, TextStyle } from "react-native";
import { useState } from "react";
import Markdown from "react-native-markdown-display";

// ✅ contenus markdown
import terms from "@/assets/content/terms";
import privacy from "@/assets/content/privacy";
import account from "@/assets/content/account";
import contact from "@/assets/content/contact";
import company from "@/assets/content/company";

type Props = {
  clientId: string;
  setIsScrolling?: (v: boolean) => void;
  setCanDrag?: (v: boolean) => void;
};

type Item = {
  key: string;
  label: string;
  content: string;
};

export default function AppMenuPanelContent({
  clientId,
  setIsScrolling,
  setCanDrag,
}: Props) {
  const [selected, setSelected] = useState<Item | null>(null);

  const items: Item[] = [
    { key: "terms", label: "Conditions d'utilisation", content: terms },
    { key: "privacy", label: "Confidentialité", content: privacy },
    { key: "account", label: "Compte", content: account },
    { key: "contact", label: "Nous contacter", content: contact },
    { key: "company", label: "Infos sur l'entreprise", content: company },

  ];

  return (
    <View style={styles.container}>
      {/* ✅ MENU */}
      {!selected && (
        <View style={styles.menu}>
          <Text style={styles.title}>Menu</Text>

          {items.map((item) => (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={() => setSelected(item)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
              <Text>→</Text>
            </Pressable>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>ID Client #{clientId}</Text>
          </View>
        </View>
      )}

      {/* ✅ CONTENU */}
      {selected && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={() => setSelected(null)}>
              <Text style={styles.back}>←</Text>
            </Pressable>

            <Text style={styles.title}>{selected.label}</Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 120 }}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}

            onStartShouldSetResponder={() => true}
            onTouchStart={() => setCanDrag?.(false)}
            onTouchEnd={() => setCanDrag?.(true)}

            scrollEventThrottle={16}
          >
            <Markdown style={markdownStyles}>
              {String(selected.content)}
            </Markdown>
          </ScrollView>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#FAFAFA",
  },

  menu: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },

  item: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,

    // ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    // ombre Android
    elevation: 2,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  footer: {
    marginTop: "auto",
    paddingVertical: 16,
  },

  footerText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  back: {
    fontSize: 22,
    marginRight: 10,
    color: "#007AFF",
  },
});


const markdownStyles: Record<string, TextStyle> = {
  body: {
    color: "#222",
    fontSize: 15,
    lineHeight: 24,
  },

  heading1: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 10,
    color: "#111",
  },

  heading2: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    color: "#111",
  },

  paragraph: {
    marginBottom: 12,
  },

  list_item: {
    marginBottom: 8,
  },

  strong: {
    fontWeight: "700",
    color: "#000",
  },

  link: {
    color: "#007AFF",
  },

  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    paddingLeft: 10,
    color: "#555",
    marginVertical: 10,
  },
};

