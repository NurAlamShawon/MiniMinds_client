import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Useaxios from "../../Hooks/Useaxios";

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d || "-";
  }
}

export default function AdminRedemptionsPending() {
  const axiosInstance = Useaxios();
  const queryClient = useQueryClient();

  // Load all redemptions; we'll filter pending on client
  const {
    data: all = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["redemptions", "all"],
    queryFn: async () => {
      const res = await axiosInstance.get("/redemptions");
      return res.data || [];
    },
    staleTime: 30_000,
  });

  // optional search box (email, recipient, city, gift name)
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const pending = all.filter((r) => !r.deliveryStatus);
    const needle = q.trim().toLowerCase();
    if (!needle) return pending;
    return pending.filter((r) => {
      const hay = `${r.email ?? ""} ${r.giftName ?? ""} ${r.address?.name ?? ""} ${r.address?.city ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [all, q]);

  // Mark as delivered
  const deliveredMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.patch(`/redemptions/${id}/delivery`, { deliveryStatus: true });
    },
    onMutate: async (id) => {
      const key = ["redemptions", "all"];
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData(key);

      if (Array.isArray(prev)) {
        queryClient.setQueryData(
          key,
          prev.map((r) =>
            r._id === id ? { ...r, deliveryStatus: true, updatedAt: new Date().toISOString() } : r
          )
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["redemptions", "all"], ctx.prev);
      window.toast?.error?.("Failed to update. Try again.");
    },
    onSuccess: () => {
      window.toast?.success?.("Marked as delivered.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["redemptions", "all"] });
    },
  });

  const handleDelivered = (id) => {
    if (!id) return;
    const ok = window.confirm("Mark this parcel as delivered?");
    if (!ok) return;
    deliveredMutation.mutate(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold">📦 Pending Gift Parcels</h2>
          <p className="text-sm opacity-70">Only items not delivered are shown.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            className="input input-bordered w-full md:w-60"
            placeholder="Search email / name / city"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={() => refetch()}>
            Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-bars loading-lg" />
        </div>
      )}

      {isError && (
        <div className="alert alert-error">
          <span>{error?.message || "Failed to load redemptions."}</span>
        </div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div className="text-center text-sm opacity-70 py-10">No pending parcels. 🎉</div>
      )}

      {/* Mobile: card list */}
      {!isLoading && !isError && rows.length > 0 && (
        <>
          <div className="grid gap-3 md:hidden">
            {rows.map((r) => (
              <div key={r._id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-14 h-14 bg-base-200">
                        {r.giftImg ? (
                          <img src={r.giftImg} alt={r.giftName} />
                        ) : (
                          <div className="flex items-center justify-center text-[10px] opacity-60">No image</div>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{r.giftName}</div>
                      <div className="text-xs opacity-60 truncate">ID: {r.giftId}</div>
                    </div>
                    <div className="ml-auto badge badge-warning">{Number(r.cost) || 0} 💎</div>
                  </div>

                  <div className="divider my-2" />

                  <div className="text-sm">
                    <div className="font-medium">{r.address?.name || "-"}</div>
                    <div className="opacity-70">{r.address?.phone || "-"}</div>
                    <div className="mt-1">
                      {r.address?.address1}
                      {r.address?.address2 ? `, ${r.address?.address2}` : ""}
                    </div>
                    <div>
                      {r.address?.city} {r.address?.postalCode}
                    </div>
                    {r.address?.notes && <div className="text-xs opacity-70 mt-1">Note: {r.address.notes}</div>}
                  </div>

                  <div className="mt-2 text-xs opacity-70">
                    <div className="truncate">Email: {r.email}</div>
                    <div>Requested: {formatDate(r.createdAt)}</div>
                  </div>

                  <div className="card-actions justify-end mt-3">
                    <button
                      className={`btn btn-success btn-sm ${deliveredMutation.isPending ? "btn-disabled" : ""}`}
                      onClick={() => handleDelivered(r._id)}
                    >
                      {deliveredMutation.isPending ? "Saving..." : "Delivered ✅"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet: table */}
          <div className="hidden md:block overflow-x-auto bg-base-100 rounded-box shadow mt-3 md:mt-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Gift</th>
                  <th>Recipient</th>
                  <th>Address</th>
                  <th>Cost</th>
                  <th>User Email</th>
                  <th>Requested</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}>
                    <td className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-200">
                            {r.giftImg ? (
                              <img src={r.giftImg} alt={r.giftName} />
                            ) : (
                              <div className="flex items-center justify-center text-[10px] opacity-60">No image</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">{r.giftName}</div>
                          <div className="text-xs opacity-60">ID: {r.giftId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="align-top">
                      <div className="font-medium">{r.address?.name || "-"}</div>
                      <div className="text-xs opacity-70">{r.address?.phone || "-"}</div>
                    </td>

                    <td className="align-top">
                      <div className="text-sm">
                        {r.address?.address1}
                        {r.address?.address2 ? `, ${r.address?.address2}` : ""}
                      </div>
                      <div className="text-sm">
                        {r.address?.city} {r.address?.postalCode}
                      </div>
                      {r.address?.notes && (
                        <div className="text-xs opacity-70 mt-1">Note: {r.address.notes}</div>
                      )}
                    </td>

                    <td className="align-top">{Number(r.cost) || 0} 💎</td>
                    <td className="align-top">{r.email}</td>
                    <td className="align-top text-xs">{formatDate(r.createdAt)}</td>

                    <td className="align-top">
                      <button
                        className={`btn btn-success btn-sm ${deliveredMutation.isPending ? "btn-disabled" : ""}`}
                        onClick={() => handleDelivered(r._id)}
                      >
                        {deliveredMutation.isPending ? "Saving..." : "Delivered ✅"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-3 text-sm opacity-70">
              Showing {rows.length} pending {rows.length === 1 ? "parcel" : "parcels"}.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
