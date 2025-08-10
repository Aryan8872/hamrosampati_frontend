// hooks/useFavorites.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FavoriteProperty } from "../types/payloadType";


const api = axios.create({
    baseURL: "http://localhost:3000/api/favorite",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export const useUserFavorites = (userId: string) =>
    useQuery({
        queryKey: ["FAVORITES", userId],
        queryFn: async () => {
            const { data } = await api.get<FavoriteProperty[]>(`/${userId}`)
            return data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });

export const useAddToFavorite = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ propertyId, userId }: { propertyId: string, userId: string }) => {
            const res = await api.post("/add", { propertyId, userId })
            return res.data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["FAVORITES"] })
    });
};


