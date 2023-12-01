import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { PromiseWithKnownReason } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/types";
import { QueryFulfilledRejectionReason } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

export type BoardMutationQueryFulfilled<T> = PromiseWithKnownReason<
  {
    data: T;
    meta: FetchBaseQueryMeta | undefined;
  },
  QueryFulfilledRejectionReason<
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      FetchBaseQueryError,
      {},
      FetchBaseQueryMeta
    >
  >
>;

export type Dispatch = ThunkDispatch<any, any, AnyAction>