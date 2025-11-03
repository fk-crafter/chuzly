"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Trash2, User2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type EventItem = {
  id: string;
  name: string;
  createdAt: string;
  votesCount: number;
  guestsCount: number;
  guestLink?: string;
};

export default function EventListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "progress">("new");
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/mine`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
        toast.error("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const filtered = useMemo(() => {
    const byQuery = events.filter((e) =>
      e.name.toLowerCase().includes(q.trim().toLowerCase())
    );
    const withRate = byQuery.map((e) => ({
      ...e,
      rate:
        e.guestsCount > 0
          ? Math.round((e.votesCount / e.guestsCount) * 100)
          : 0,
    }));
    if (sort === "new")
      return withRate.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sort === "old")
      return withRate.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    return withRate.sort((a, b) => b.rate - a.rate);
  }, [events, q, sort]);

  const confirmDelete = async (eventId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast.success("Event deleted");
    } catch (err) {
      console.error("Failed to delete event", err);
      toast.error("Failed to delete event");
    } finally {
      setPendingDelete(null);
    }
  };

  const viewLinks = (id: string) => {
    window.location.href = `/app/share?id=${id}`;
  };

  const viewVotes = (ev: EventItem) => {
    if (!ev.guestLink) return;
    const guest = encodeURIComponent(ev.guestLink.split("/guest/")[1]);
    window.location.href = `/app/vote?id=${ev.id}&guest=${guest}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:pl-64 py-8 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-40 md:w-64" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 md:p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 md:pl-64 py-16 md:py-20 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">My Events</h1>
        <p className="text-muted-foreground mb-6">
          You haven’t created any events yet.
        </p>
        <Link href="/app/create-event">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create your first event
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:pl-64 py-8 md:py-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Events</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative w-full sm:w-72 md:w-64">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search an event…"
              className="pl-8 h-9"
            />
          </div>

          <Select value={sort} onValueChange={(v: any) => setSort(v)}>
            <SelectTrigger className="h-9 sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="old">Oldest</SelectItem>
              <SelectItem value="progress">Highest progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {filtered.map((event) => {
          const rate =
            event.guestsCount > 0
              ? Math.round((event.votesCount / event.guestsCount) * 100)
              : 0;

          const rateColor =
            rate === 100
              ? "bg-green-600"
              : rate >= 50
              ? "bg-yellow-500"
              : "bg-red-500";

          return (
            <Card
              key={event.id}
              className="group relative overflow-hidden border-border/80 hover:shadow-md transition"
            >
              <CardHeader className="pb-2 md:pb-3 px-4 md:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base md:text-lg leading-tight">
                      {event.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on{" "}
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setPendingDelete(event)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-4 md:px-6 pb-4 md:pb-6 space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Badge variant="outline" className="gap-1">
                    <User2 className="w-3.5 h-3.5" />
                    {event.votesCount}/{event.guestsCount} voted
                  </Badge>
                  <Badge className={cn("text-white", rateColor)}>
                    {rate}% done
                  </Badge>
                </div>

                <div className="h-1.5 md:h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full transition-all", rateColor)}
                    style={{ width: `${rate}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="cursor-pointer flex-1 md:flex-none"
                    onClick={() => viewLinks(event.id)}
                  >
                    View Links
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="cursor-pointer flex-1 md:flex-none"
                    onClick={() => viewVotes(event)}
                    disabled={!event.guestLink}
                  >
                    View Votes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={() => setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event and all related votes will
              be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => pendingDelete && confirmDelete(pendingDelete.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
