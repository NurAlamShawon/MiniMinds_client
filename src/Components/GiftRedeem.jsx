import React, { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ValueContext } from "../Context/ValueContext";
import Useaxios from "../Hooks/Useaxios";


export default function GiftRedeem() {
  const axiosInstance = Useaxios();
  const queryClient = useQueryClient();
  const { currentuser } = useContext(ValueContext);
  const isLoggedIn = !!currentuser?.email;

  // 1) Load user (for gems)
  const { data: dbUser } = useQuery({
    queryKey: ["user", currentuser?.email],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users?email=${currentuser.email}`);
      return res.data?.[0];
    },
    staleTime: 0,
  });

  const gems = dbUser?.gems ?? 0;

  // 2) Load gifts from /public/Gift.json
  const {
    data: gifts = [],
    isLoading: giftsLoading,
    isError: giftsError,
  } = useQuery({
    queryKey: ["gifts"],
    queryFn: async () => {
      const res = await fetch("/Gift.json");
      if (!res.ok) throw new Error("Failed to load gifts");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // 3) UI state for modal + address
  const [open, setOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [address, setAddress] = useState({
    name: dbUser?.name || currentuser?.displayName || "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  // Prefill name when user loads
  useEffect(() => {
    if (dbUser?.name || currentuser?.displayName) {
      setAddress((prev) => ({
        ...prev,
        name: prev.name || dbUser?.name || currentuser?.displayName || "",
      }));
    }
  }, [dbUser?.name, currentuser?.displayName]);

  const canAfford = useMemo(() => {
    const cost = Number(selectedGift?.cost ?? 0);
    return gems >= cost;
  }, [selectedGift, gems]);

  const onOpenRedeem = (gift) => {
    if (!isLoggedIn) {
      (window).toast?.info?.("Please log in to redeem gifts.");
      return;
    }
    setSelectedGift(gift);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedGift(null);
  };

  // 4) Mutation: create redemption + deduct gems using /gems/:email/deduct
  const redeemMutation = useMutation({
    mutationFn: async ({ gift, address }) => {
      const cost = Number(gift.cost);
      if (!Number.isFinite(cost) || cost <= 0) {
        throw new Error("Price not set for this gift");
      }

      // 1) Create a redemption
      await axiosInstance.post("/redemptions", {
        email: currentuser.email,
        giftId: gift.id,
        giftName: gift.name,
        giftImg: gift.img,
        cost,
        address,
        createdAt: new Date().toISOString(),
      });

      // 2) Deduct gems (server clamps at >=0)
      const { data } = await axiosInstance.patch(
        `/gems/${currentuser.email}/deduct`,
        { cost }
      );
      // data: { ok: true, email, gems }
      return data;
    },

    // Optimistic update
    onMutate: async ({ gift }) => {
      const cost = Number(gift.cost ?? 0);
      const key = ["user", currentuser?.email];

      await queryClient.cancelQueries({ queryKey: key });
      const prevUser = queryClient.getQueryData(key);

      if (prevUser && Number.isFinite(cost)) {
        queryClient.setQueryData(key, {
          ...prevUser,
          gems: Math.max(0, (prevUser.gems ?? 0) - cost),
        });
      }
      return { prevUser };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prevUser && currentuser?.email) {
        queryClient.setQueryData(["user", currentuser.email], ctx.prevUser);
      }
      (window).toast?.error?.(err?.response?.data?.error || err?.message || "Redemption failed. Please try again.");
    },

    onSuccess: (data) => {
      // Ensure cache matches server's final gems
      if (data?.gems != null && currentuser?.email) {
        queryClient.setQueryData(["user", currentuser.email], (prev) =>
          prev ? { ...prev, gems: data.gems } : prev
        );
      }
      (window).toast?.success?.("Redeemed! We’ll ship your gift soon.");
    },

    onSettled: () => {
      if (currentuser?.email) {
        queryClient.invalidateQueries({ queryKey: ["user", currentuser.email] });
      }
      closeModal();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGift) return;

    const cost = Number(selectedGift.cost);
    if (!Number.isFinite(cost) || cost <= 0) {
      (window).toast?.info?.("This gift doesn't have a price yet.");
      return;
    }
    if (!isLoggedIn) {
      (window).toast?.info?.("Please log in to redeem gifts.");
      return;
    }
    if (gems < cost) {
      (window).toast?.info?.("Not enough gems to redeem this gift.");
      return;
    }

    const required = ["name", "phone", "address1", "city", "postalCode"];
    for (const f of required) {
      if (!address[f]) {
        (window).toast?.info?.("Please fill all required fields.");
        return;
      }
    }

    redeemMutation.mutate({ gift: selectedGift, address });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">🎁 Redeem Gifts</h2>
          <p className="text-sm opacity-70">Trade your gems for real goodies!</p>
        </div>
        <div className="badge badge-warning gap-2 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3l3.09 3.09L21 7.5l-9 13.5L3 7.5l5.91-1.41L12 3z" />
          </svg>
          <span className="font-semibold">{isLoggedIn ? gems : "Login to see gems"}</span>
        </div>
      </div>

      {/* Gifts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {giftsLoading && (
          <div className="col-span-full flex justify-center py-10">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        )}
        {giftsError && (
          <div className="col-span-full text-center text-error py-6">
            Failed to load gifts. Please refresh.
          </div>
        )}

        {!giftsLoading && !giftsError && gifts.map((g) => {
          const hasPrice = g.cost != null && Number.isFinite(Number(g.cost)) && Number(g.cost) > 0;
          const cost = hasPrice ? Number(g.cost) : 0;
          const disabled = !isLoggedIn || !hasPrice || gems < cost || redeemMutation.isLoading;

          return (
            <div key={g.id} className="card bg-base-100 shadow hover:shadow-lg transition h-full">
              <figure className="px-4 pt-6">
                <div className="w-full aspect-square flex items-center justify-center">
                  <img src={g.img} alt={g.name} className="max-h-40 object-contain" />
                </div>
              </figure>

              <div className="card-body p-4 flex flex-col items-center text-center">
                <h3 className="card-title text-base">{g.name}</h3>

                <div className="text-sm opacity-70">
                  Cost:{" "}
                  {!hasPrice ? (
                    <span className="badge badge-ghost align-middle">Set price</span>
                  ) : (
                    <span className="badge badge-warning gap-1 align-middle">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3l3.09 3.09L21 7.5l-9 13.5L3 7.5l5.91-1.41L12 3z" />
                      </svg>
                      {cost}
                    </span>
                  )}
                </div>

                <div className="card-actions w-full mt-auto">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => onOpenRedeem(g)}
                    disabled={disabled}
                    title={
                      !isLoggedIn
                        ? "Login first"
                        : !hasPrice
                        ? "Price not set"
                        : gems < cost
                        ? "Not enough gems"
                        : ""
                    }
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Redeem Modal */}
      {open && selectedGift && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded bg-base-200 flex items-center justify-center">
                <img src={selectedGift.img} alt={selectedGift.name} className="h-12 w-12 object-contain" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg truncate">{selectedGift.name}</h3>
                <p className="text-sm opacity-70">
                  Cost:{" "}
                  {selectedGift.cost == null ? (
                    <span className="badge badge-ghost">Set price</span>
                  ) : (
                    <span className="badge badge-warning">{Number(selectedGift.cost)} gems</span>
                  )}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Recipient Name *</span></div>
                  <input type="text" className="input input-bordered w-full" value={address.name}
                    onChange={(e) => setAddress((s) => ({ ...s, name: e.target.value }))} required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Phone *</span></div>
                  <input type="tel" className="input input-bordered w-full" value={address.phone}
                    onChange={(e) => setAddress((s) => ({ ...s, phone: e.target.value }))} required />
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label"><span className="label-text">Address Line 1 *</span></div>
                <input type="text" className="input input-bordered w-full" value={address.address1}
                  onChange={(e) => setAddress((s) => ({ ...s, address1: e.target.value }))} required />
              </label>

              <label className="form-control w-full">
                <div className="label"><span className="label-text">Address Line 2</span></div>
                <input type="text" className="input input-bordered w-full" value={address.address2}
                  onChange={(e) => setAddress((s) => ({ ...s, address2: e.target.value }))} />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control w-full">
                  <div className="label"><span className="label-text">City *</span></div>
                  <input type="text" className="input input-bordered w-full" value={address.city}
                    onChange={(e) => setAddress((s) => ({ ...s, city: e.target.value }))} required />
                </label>

                <label className="form-control w-full">
                  <div className="label"><span className="label-text">Postal Code *</span></div>
                  <input type="text" className="input input-bordered w-full" value={address.postalCode}
                    onChange={(e) => setAddress((s) => ({ ...s, postalCode: e.target.value }))} required />
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label"><span className="label-text">Notes</span></div>
                <textarea className="textarea textarea-bordered w-full" rows={3} value={address.notes}
                  onChange={(e) => setAddress((s) => ({ ...s, notes: e.target.value }))} placeholder="Delivery instructions, landmark, etc." />
              </label>

              <div className="modal-action justify-end gap-2 pt-1">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className={`btn btn-primary ${redeemMutation.isLoading ? "loading" : ""}`}
                  disabled={redeemMutation.isLoading || !canAfford}>
                  {redeemMutation.isLoading ? "Processing" : "Confirm Redeem"}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={closeModal} />
        </div>
      )}
    </div>
  );
}
