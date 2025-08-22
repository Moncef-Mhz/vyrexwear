"use client";

import {
  banUser,
  deleteUser,
  getUsers,
  unbanUser,
  updateUserRole,
} from "@/app/actions/auth";
import { SelectUser } from "@/types/auth";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  CalendarIcon,
  MoreHorizontal,
  ShieldCheck,
  ShieldX,
  Trash2,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { cn, timeAgo } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatDate } from "date-fns";

const UsersMain = () => {
  const [users, setUsers] = useState<SelectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banExpires, setBanExpires] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        if (!res.users) return;
        setUsers(res.users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    setUpdatingUserId(selectedUser.id);
    try {
      const expiresAt = banExpires ? banExpires : undefined;
      await banUser(selectedUser.id, banReason, expiresAt);
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                banned: true,
                banReason,
                banExpires: expiresAt || null,
              }
            : user
        )
      );
      setBanDialogOpen(false);
      setBanReason("");
      setBanExpires(null);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to ban user:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setUpdatingUserId(userId);
    try {
      await unbanUser(userId);
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, banned: false, banReason: null, banExpires: null }
            : user
        )
      );
    } catch (error) {
      console.error("Failed to unban user:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  console.log(users);

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Banned</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell>Loading</TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="size-10 bg-muted flex items-center justify-center rounded-full">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role || "customer"}
                      onValueChange={(value) =>
                        handleRoleUpdate(user.id, value)
                      }
                      disabled={updatingUserId === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <div className="flex items-center gap-2">
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Customer
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>
                    {user.banned ? (
                      <div className="space-y-1">
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-1 w-fit"
                        >
                          <ShieldX className="h-3 w-3" />
                          Banned
                        </Badge>
                        {user.banReason && (
                          <div className="text-xs text-muted-foreground max-w-32 truncate">
                            {user.banReason}
                          </div>
                        )}
                        {user.banExpires && (
                          <div className="text-xs text-orange-600">
                            Until{" "}
                            {new Date(user.banExpires).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        <UserCheck className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{timeAgo(new Date(user.createdAt))}</div>

                        <div className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {user.banned ? (
                          <DropdownMenuItem
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Unban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setBanDialogOpen(true);
                            }}
                            variant="destructive"
                            className="text-orange-600"
                          >
                            <ShieldX className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          variant="destructive"
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}? This will prevent them from accessing
              the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banReason">Reason for ban</Label>
              <Textarea
                id="banReason"
                placeholder="Enter the reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banExpires">Ban expires (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !banExpires && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {banExpires ? (
                      formatDate(banExpires, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    required={true}
                    selected={banExpires ? banExpires : undefined}
                    onSelect={setBanExpires}
                  />
                </PopoverContent>
              </Popover>

              <p className="text-xs text-muted-foreground mt-1">
                Leave empty for permanent ban
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={
                !banReason.trim() || updatingUserId === selectedUser?.id
              }
            >
              {updatingUserId === selectedUser?.id ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default UsersMain;
