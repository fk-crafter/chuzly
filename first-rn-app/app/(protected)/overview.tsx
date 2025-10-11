import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  CalendarCheck,
  Users,
  CheckCircle,
  BarChart3,
} from "lucide-react-native";
import { API_URL } from "../../config";

type OverviewStats = {
  totalEvents: number;
  totalVotes: number;
  totalGuests: number;
  upcomingEvents: number;
};

type UpcomingEvent = {
  id: string;
  name: string;
  votingDeadline: string;
  guestsCount: number;
  votesCount: number;
};

export default function OverviewScreen() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fmt = (n: number) =>
    n >= 1000 ? Intl.NumberFormat("en", { notation: "compact" }).format(n) : n;

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const fetchAll = async () => {
      const token = await Promise.resolve(localStorage?.getItem?.("token"));
      // si tu n'utilises pas localStorage en RN, remplace par AsyncStorage
      try {
        const s = await fetch(`${API_URL}/events/overview`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const sJson = (await s.json()) as OverviewStats;
        setStats(sJson);

        const u = await fetch(`${API_URL}/events/upcoming?limit=5`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setUpcoming(u.ok ? ((await u.json()) as UpcomingEvent[]) : []);
      } catch (e) {
        setUpcoming([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!stats) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Failed to load.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white px-6 pt-16"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold mb-6">Overview</Text>

      {/* KPI cards */}
      <View className="grid grid-cols-1 gap-4">
        <View className="border rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <CalendarCheck size={18} color="#6b7280" />
            <Text className="text-sm text-gray-700">Total Events</Text>
          </View>
          <Text className="text-3xl font-bold">{fmt(stats.totalEvents)}</Text>
        </View>

        <View className="border rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <BarChart3 size={18} color="#16a34a" />
            <Text className="text-sm text-gray-700">Total Votes</Text>
          </View>
          <Text className="text-3xl font-bold">{fmt(stats.totalVotes)}</Text>
        </View>

        <View className="border rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Users size={18} color="#2563eb" />
            <Text className="text-sm text-gray-700">Guests</Text>
          </View>
          <Text className="text-3xl font-bold">{fmt(stats.totalGuests)}</Text>
        </View>

        <View className="border rounded-xl p-4">
          <View className="flex-row items-center gap-2 mb-2">
            <CheckCircle size={18} color="#7c3aed" />
            <Text className="text-sm text-gray-700">Upcoming Deadlines</Text>
          </View>
          <Text className="text-3xl font-bold">
            {fmt(stats.upcomingEvents)}
          </Text>
        </View>
      </View>

      {/* Upcoming */}
      <View className="border rounded-xl p-4 mt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-semibold">Upcoming deadlines</Text>
          <TouchableOpacity
            className="border rounded-full px-4 py-2"
            onPress={() => router.push("/event-list")}
          >
            <Text className="font-medium">Manage</Text>
          </TouchableOpacity>
        </View>

        {upcoming && upcoming.length > 0 ? (
          <View className="gap-3">
            {upcoming.map((ev) => {
              const rate =
                ev.guestsCount > 0
                  ? Math.round((ev.votesCount / ev.guestsCount) * 100)
                  : 0;
              const barColor =
                rate === 100
                  ? "bg-green-600"
                  : rate >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500";

              return (
                <View key={ev.id} className="border rounded-lg p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="max-w-[70%]">
                      <Text numberOfLines={1} className="font-medium">
                        {ev.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Deadline: {dateFmt(ev.votingDeadline)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="border rounded-full px-3 py-1"
                      onPress={() =>
                        router.push(`/share?id=${encodeURIComponent(ev.id)}`)
                      }
                    >
                      <Text>Manage</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-xs text-gray-500">
                      {ev.votesCount}/{ev.guestsCount} voted
                    </Text>
                    <View className={`px-2 py-0.5 rounded ${barColor}`}>
                      <Text className="text-white text-xs">{rate}% done</Text>
                    </View>
                  </View>

                  <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <View
                      className={`h-2 ${barColor}`}
                      style={{ width: `${rate}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text className="text-sm text-gray-500">No upcoming deadlines.</Text>
        )}
      </View>
    </ScrollView>
  );
}
