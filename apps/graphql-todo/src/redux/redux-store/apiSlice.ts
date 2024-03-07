import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie"
const Cookies = require("js-cookie");

// export const backendurl = process.env.BACKEND_URL || "https://dummyjson.com/"
const backendurl = "http://localhost:8000/graphql";
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoicmFtQGdtYWlsLmNvbSIsImlhdCI6MTcwOTcxNjk2MSwiZXhwIjoxNzEwMTQ4OTYxfQ.kOk2l3OFmhnzvKuPl9ZHZJexNt17Rw8Lyes3y9Ofmag";
const refresh_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZG9lQGdtYWlsLmNvbSIsImlhdCI6MTcwOTcwNjI4NywiZXhwIjoxNzA5NzA2NDY3fQ.t3lUnLAREzJeR3-5F4p4tuzeSBfUbr1Wy9JZrFMkhPw";
Cookies.set("access_token", access_token);
Cookies.set("refresh_token", refresh_token);
const baseQuery = fetchBaseQuery({
  baseUrl: backendurl,
  // here we are preparing the headers that need to be sent with each request
  prepareHeaders: (headers) => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      headers.set("Authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  const result = await baseQuery(args, api, extraOptions);
  // if the auth token is expired, we will try to refresh it using the refress token and then set it in headers and send the request again
  if (result.error && result.error.status === 401) {
    const refresh_token = Cookies.get("refresh_token");
    if (refresh_token) {
      const refreshResult: any = await baseQuery(
        {
          url: "auth/token/refresh/",
          method: "POST",
          body: { refresh: refresh_token },
        },
        api,
        extraOptions
      );
      console.log(refreshResult, "refreshResult");
      if (refreshResult.data) {
        Cookies.set("access_token", refreshResult.data.access);
        const result = baseQuery(args, api, extraOptions);
        return result;
      } else {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
      }
    }
  }
  return result;
};
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["book"],
  endpoints: (builder) => ({}),
});
