import { apiSlice } from "@/redux/redux-store/apiSlice";

const BookApiService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookData: builder.query<any, any>({
      query: () => ({
        url: "",
        method: "POST",  // Use POST for queries
        body: {
          query: `
            query {
              getAllBooks {
                id
                title
                price
              }
            }
          `,
        },
      }),
      providesTags: ["book"],
    }),
  
    getBookById: builder.query<any, { id: number }>({
        query: (data) => ({
          url: "",
          method: "Post",
          body: {
            query: `
              query {
                getBookById(id: ${data.id}) {
                  id
                  title
                  price
                }
              }
            `,
          },
        }),
        providesTags: ["book"], // Update with appropriate tag
      }),
    createBook: builder.mutation<any, { createBookData: { title: string; price: number } }>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation {
              addBook(createBookData: {
                title: "${data.createBookData.title}",
                price: ${data.createBookData.price}
              }) {
                id
                title
                price
              }
            }
          `,
        },
      }),
      invalidatesTags: ["book"],
    }),
  }),
});

export const {
    useCreateBookMutation,
    useGetBookDataQuery,
    useGetBookByIdQuery,
} = BookApiService;
