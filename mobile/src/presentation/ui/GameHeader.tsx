import { View, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"
import { progression } from "@/src/meta/progression/ProgressionService"
import SettingsIcon from "@/assets/gameimg/settings-icon.svg"
import GoldIcon from "@/assets/gameimg/money-gold-icon.svg"
import BubbleIcon from "@/assets/gameimg/money-bubble-icon.svg"
import ShopIcon from "@/assets/gameimg/shop-icon.svg"



export default function GameHeader() {
    const gold = progression.getState().currency.gold
    const bubble = progression.getState().currency.bubble

    const formatGold = (value: number) => value.toString().padStart(5, "0")
    const formatBubble = (value: number) => value.toString().padStart(4, "0")


    return (
        <View style={styles.container}>
            {/* LEFT */}
            <Pressable
                onPress={() => router.push("/(game)/settings")}
                style={styles.btn}
            >
                <SettingsIcon width={30} height={30} />
            </Pressable>

            {/* CENTER */}
            <View style={styles.resources}>
                {/* GOLD */}
                <View style={styles.badge}>
                    <GoldIcon width={18} height={18} />
                    <Text style={styles.badgeText}>{formatGold(gold)}</Text>
                </View>

                {/* BUBBLE */}
                <View style={styles.badge}>
                    <BubbleIcon width={18} height={18} />
                    <Text style={styles.badgeText}>{formatBubble(bubble)}</Text>
                </View>
            </View>


            {/* RIGHT */}
            <Pressable
                onPress={() => router.push("/(game)/shop")}
            >
                <ShopIcon width={45} height={45} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },

btn: {
  backgroundColor: "#000",
  padding: 10,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: "#fff",
},


    text: {
        color: "#fff",
        fontSize: 16,
    },

    resources: {
        flexDirection: "row",
        gap: 12,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#22C55E",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 6,
    },

    badgeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },


    resource: {
        fontSize: 16,
    },
})
