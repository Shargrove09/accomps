
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model Accomplishment
 * 
 */
export type Accomplishment = $Result.DefaultSelection<Prisma.$AccomplishmentPayload>
/**
 * Model AccomplishmentTag
 * 
 */
export type AccomplishmentTag = $Result.DefaultSelection<Prisma.$AccomplishmentTagPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.category.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accomplishment`: Exposes CRUD operations for the **Accomplishment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accomplishments
    * const accomplishments = await prisma.accomplishment.findMany()
    * ```
    */
  get accomplishment(): Prisma.AccomplishmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.accomplishmentTag`: Exposes CRUD operations for the **AccomplishmentTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AccomplishmentTags
    * const accomplishmentTags = await prisma.accomplishmentTag.findMany()
    * ```
    */
  get accomplishmentTag(): Prisma.AccomplishmentTagDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Category: 'Category',
    Tag: 'Tag',
    Accomplishment: 'Accomplishment',
    AccomplishmentTag: 'AccomplishmentTag'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "category" | "tag" | "accomplishment" | "accomplishmentTag"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      Accomplishment: {
        payload: Prisma.$AccomplishmentPayload<ExtArgs>
        fields: Prisma.AccomplishmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccomplishmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccomplishmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          findFirst: {
            args: Prisma.AccomplishmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccomplishmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          findMany: {
            args: Prisma.AccomplishmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>[]
          }
          create: {
            args: Prisma.AccomplishmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          createMany: {
            args: Prisma.AccomplishmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccomplishmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>[]
          }
          delete: {
            args: Prisma.AccomplishmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          update: {
            args: Prisma.AccomplishmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          deleteMany: {
            args: Prisma.AccomplishmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccomplishmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccomplishmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>[]
          }
          upsert: {
            args: Prisma.AccomplishmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentPayload>
          }
          aggregate: {
            args: Prisma.AccomplishmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccomplishment>
          }
          groupBy: {
            args: Prisma.AccomplishmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccomplishmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccomplishmentCountArgs<ExtArgs>
            result: $Utils.Optional<AccomplishmentCountAggregateOutputType> | number
          }
        }
      }
      AccomplishmentTag: {
        payload: Prisma.$AccomplishmentTagPayload<ExtArgs>
        fields: Prisma.AccomplishmentTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccomplishmentTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccomplishmentTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          findFirst: {
            args: Prisma.AccomplishmentTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccomplishmentTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          findMany: {
            args: Prisma.AccomplishmentTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>[]
          }
          create: {
            args: Prisma.AccomplishmentTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          createMany: {
            args: Prisma.AccomplishmentTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccomplishmentTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>[]
          }
          delete: {
            args: Prisma.AccomplishmentTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          update: {
            args: Prisma.AccomplishmentTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          deleteMany: {
            args: Prisma.AccomplishmentTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccomplishmentTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccomplishmentTagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>[]
          }
          upsert: {
            args: Prisma.AccomplishmentTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccomplishmentTagPayload>
          }
          aggregate: {
            args: Prisma.AccomplishmentTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccomplishmentTag>
          }
          groupBy: {
            args: Prisma.AccomplishmentTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccomplishmentTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccomplishmentTagCountArgs<ExtArgs>
            result: $Utils.Optional<AccomplishmentTagCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    category?: CategoryOmit
    tag?: TagOmit
    accomplishment?: AccomplishmentOmit
    accomplishmentTag?: AccomplishmentTagOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    accomplishments: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishments?: boolean | CategoryCountOutputTypeCountAccomplishmentsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountAccomplishmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccomplishmentWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    accomplishments: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishments?: boolean | TagCountOutputTypeCountAccomplishmentsArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountAccomplishmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccomplishmentTagWhereInput
  }


  /**
   * Count Type AccomplishmentCountOutputType
   */

  export type AccomplishmentCountOutputType = {
    tags: number
  }

  export type AccomplishmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tags?: boolean | AccomplishmentCountOutputTypeCountTagsArgs
  }

  // Custom InputTypes
  /**
   * AccomplishmentCountOutputType without action
   */
  export type AccomplishmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentCountOutputType
     */
    select?: AccomplishmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccomplishmentCountOutputType without action
   */
  export type AccomplishmentCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccomplishmentTagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accomplishments?: boolean | Category$accomplishmentsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "color" | "createdAt" | "updatedAt", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishments?: boolean | Category$accomplishmentsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      accomplishments: Prisma.$AccomplishmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accomplishments<T extends Category$accomplishmentsArgs<ExtArgs> = {}>(args?: Subset<T, Category$accomplishmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly description: FieldRef<"Category", 'String'>
    readonly color: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.accomplishments
   */
  export type Category$accomplishmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    where?: AccomplishmentWhereInput
    orderBy?: AccomplishmentOrderByWithRelationInput | AccomplishmentOrderByWithRelationInput[]
    cursor?: AccomplishmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccomplishmentScalarFieldEnum | AccomplishmentScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    description: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    name: string
    description: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accomplishments?: boolean | Tag$accomplishmentsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "color" | "createdAt" | "updatedAt", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishments?: boolean | Tag$accomplishmentsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      accomplishments: Prisma.$AccomplishmentTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accomplishments<T extends Tag$accomplishmentsArgs<ExtArgs> = {}>(args?: Subset<T, Tag$accomplishmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly description: FieldRef<"Tag", 'String'>
    readonly color: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
    readonly updatedAt: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.accomplishments
   */
  export type Tag$accomplishmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    where?: AccomplishmentTagWhereInput
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    cursor?: AccomplishmentTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccomplishmentTagScalarFieldEnum | AccomplishmentTagScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model Accomplishment
   */

  export type AggregateAccomplishment = {
    _count: AccomplishmentCountAggregateOutputType | null
    _min: AccomplishmentMinAggregateOutputType | null
    _max: AccomplishmentMaxAggregateOutputType | null
  }

  export type AccomplishmentMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    date: Date | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccomplishmentMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    date: Date | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccomplishmentCountAggregateOutputType = {
    id: number
    title: number
    description: number
    date: number
    categoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccomplishmentMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    date?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccomplishmentMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    date?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccomplishmentCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    date?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccomplishmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accomplishment to aggregate.
     */
    where?: AccomplishmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accomplishments to fetch.
     */
    orderBy?: AccomplishmentOrderByWithRelationInput | AccomplishmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccomplishmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accomplishments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accomplishments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accomplishments
    **/
    _count?: true | AccomplishmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccomplishmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccomplishmentMaxAggregateInputType
  }

  export type GetAccomplishmentAggregateType<T extends AccomplishmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAccomplishment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccomplishment[P]>
      : GetScalarType<T[P], AggregateAccomplishment[P]>
  }




  export type AccomplishmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccomplishmentWhereInput
    orderBy?: AccomplishmentOrderByWithAggregationInput | AccomplishmentOrderByWithAggregationInput[]
    by: AccomplishmentScalarFieldEnum[] | AccomplishmentScalarFieldEnum
    having?: AccomplishmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccomplishmentCountAggregateInputType | true
    _min?: AccomplishmentMinAggregateInputType
    _max?: AccomplishmentMaxAggregateInputType
  }

  export type AccomplishmentGroupByOutputType = {
    id: string
    title: string
    description: string | null
    date: Date
    categoryId: string
    createdAt: Date
    updatedAt: Date
    _count: AccomplishmentCountAggregateOutputType | null
    _min: AccomplishmentMinAggregateOutputType | null
    _max: AccomplishmentMaxAggregateOutputType | null
  }

  type GetAccomplishmentGroupByPayload<T extends AccomplishmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccomplishmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccomplishmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccomplishmentGroupByOutputType[P]>
            : GetScalarType<T[P], AccomplishmentGroupByOutputType[P]>
        }
      >
    >


  export type AccomplishmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    tags?: boolean | Accomplishment$tagsArgs<ExtArgs>
    _count?: boolean | AccomplishmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishment"]>

  export type AccomplishmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishment"]>

  export type AccomplishmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishment"]>

  export type AccomplishmentSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccomplishmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "date" | "categoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["accomplishment"]>
  export type AccomplishmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    tags?: boolean | Accomplishment$tagsArgs<ExtArgs>
    _count?: boolean | AccomplishmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AccomplishmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }
  export type AccomplishmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }

  export type $AccomplishmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Accomplishment"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
      tags: Prisma.$AccomplishmentTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      date: Date
      categoryId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["accomplishment"]>
    composites: {}
  }

  type AccomplishmentGetPayload<S extends boolean | null | undefined | AccomplishmentDefaultArgs> = $Result.GetResult<Prisma.$AccomplishmentPayload, S>

  type AccomplishmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccomplishmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccomplishmentCountAggregateInputType | true
    }

  export interface AccomplishmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Accomplishment'], meta: { name: 'Accomplishment' } }
    /**
     * Find zero or one Accomplishment that matches the filter.
     * @param {AccomplishmentFindUniqueArgs} args - Arguments to find a Accomplishment
     * @example
     * // Get one Accomplishment
     * const accomplishment = await prisma.accomplishment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccomplishmentFindUniqueArgs>(args: SelectSubset<T, AccomplishmentFindUniqueArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Accomplishment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccomplishmentFindUniqueOrThrowArgs} args - Arguments to find a Accomplishment
     * @example
     * // Get one Accomplishment
     * const accomplishment = await prisma.accomplishment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccomplishmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AccomplishmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accomplishment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentFindFirstArgs} args - Arguments to find a Accomplishment
     * @example
     * // Get one Accomplishment
     * const accomplishment = await prisma.accomplishment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccomplishmentFindFirstArgs>(args?: SelectSubset<T, AccomplishmentFindFirstArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Accomplishment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentFindFirstOrThrowArgs} args - Arguments to find a Accomplishment
     * @example
     * // Get one Accomplishment
     * const accomplishment = await prisma.accomplishment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccomplishmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AccomplishmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accomplishments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accomplishments
     * const accomplishments = await prisma.accomplishment.findMany()
     * 
     * // Get first 10 Accomplishments
     * const accomplishments = await prisma.accomplishment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accomplishmentWithIdOnly = await prisma.accomplishment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccomplishmentFindManyArgs>(args?: SelectSubset<T, AccomplishmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Accomplishment.
     * @param {AccomplishmentCreateArgs} args - Arguments to create a Accomplishment.
     * @example
     * // Create one Accomplishment
     * const Accomplishment = await prisma.accomplishment.create({
     *   data: {
     *     // ... data to create a Accomplishment
     *   }
     * })
     * 
     */
    create<T extends AccomplishmentCreateArgs>(args: SelectSubset<T, AccomplishmentCreateArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accomplishments.
     * @param {AccomplishmentCreateManyArgs} args - Arguments to create many Accomplishments.
     * @example
     * // Create many Accomplishments
     * const accomplishment = await prisma.accomplishment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccomplishmentCreateManyArgs>(args?: SelectSubset<T, AccomplishmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accomplishments and returns the data saved in the database.
     * @param {AccomplishmentCreateManyAndReturnArgs} args - Arguments to create many Accomplishments.
     * @example
     * // Create many Accomplishments
     * const accomplishment = await prisma.accomplishment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accomplishments and only return the `id`
     * const accomplishmentWithIdOnly = await prisma.accomplishment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccomplishmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AccomplishmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Accomplishment.
     * @param {AccomplishmentDeleteArgs} args - Arguments to delete one Accomplishment.
     * @example
     * // Delete one Accomplishment
     * const Accomplishment = await prisma.accomplishment.delete({
     *   where: {
     *     // ... filter to delete one Accomplishment
     *   }
     * })
     * 
     */
    delete<T extends AccomplishmentDeleteArgs>(args: SelectSubset<T, AccomplishmentDeleteArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Accomplishment.
     * @param {AccomplishmentUpdateArgs} args - Arguments to update one Accomplishment.
     * @example
     * // Update one Accomplishment
     * const accomplishment = await prisma.accomplishment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccomplishmentUpdateArgs>(args: SelectSubset<T, AccomplishmentUpdateArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accomplishments.
     * @param {AccomplishmentDeleteManyArgs} args - Arguments to filter Accomplishments to delete.
     * @example
     * // Delete a few Accomplishments
     * const { count } = await prisma.accomplishment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccomplishmentDeleteManyArgs>(args?: SelectSubset<T, AccomplishmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accomplishments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accomplishments
     * const accomplishment = await prisma.accomplishment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccomplishmentUpdateManyArgs>(args: SelectSubset<T, AccomplishmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accomplishments and returns the data updated in the database.
     * @param {AccomplishmentUpdateManyAndReturnArgs} args - Arguments to update many Accomplishments.
     * @example
     * // Update many Accomplishments
     * const accomplishment = await prisma.accomplishment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accomplishments and only return the `id`
     * const accomplishmentWithIdOnly = await prisma.accomplishment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccomplishmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AccomplishmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Accomplishment.
     * @param {AccomplishmentUpsertArgs} args - Arguments to update or create a Accomplishment.
     * @example
     * // Update or create a Accomplishment
     * const accomplishment = await prisma.accomplishment.upsert({
     *   create: {
     *     // ... data to create a Accomplishment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Accomplishment we want to update
     *   }
     * })
     */
    upsert<T extends AccomplishmentUpsertArgs>(args: SelectSubset<T, AccomplishmentUpsertArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accomplishments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentCountArgs} args - Arguments to filter Accomplishments to count.
     * @example
     * // Count the number of Accomplishments
     * const count = await prisma.accomplishment.count({
     *   where: {
     *     // ... the filter for the Accomplishments we want to count
     *   }
     * })
    **/
    count<T extends AccomplishmentCountArgs>(
      args?: Subset<T, AccomplishmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccomplishmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Accomplishment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccomplishmentAggregateArgs>(args: Subset<T, AccomplishmentAggregateArgs>): Prisma.PrismaPromise<GetAccomplishmentAggregateType<T>>

    /**
     * Group by Accomplishment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccomplishmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccomplishmentGroupByArgs['orderBy'] }
        : { orderBy?: AccomplishmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccomplishmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccomplishmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Accomplishment model
   */
  readonly fields: AccomplishmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Accomplishment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccomplishmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tags<T extends Accomplishment$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Accomplishment$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Accomplishment model
   */
  interface AccomplishmentFieldRefs {
    readonly id: FieldRef<"Accomplishment", 'String'>
    readonly title: FieldRef<"Accomplishment", 'String'>
    readonly description: FieldRef<"Accomplishment", 'String'>
    readonly date: FieldRef<"Accomplishment", 'DateTime'>
    readonly categoryId: FieldRef<"Accomplishment", 'String'>
    readonly createdAt: FieldRef<"Accomplishment", 'DateTime'>
    readonly updatedAt: FieldRef<"Accomplishment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Accomplishment findUnique
   */
  export type AccomplishmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter, which Accomplishment to fetch.
     */
    where: AccomplishmentWhereUniqueInput
  }

  /**
   * Accomplishment findUniqueOrThrow
   */
  export type AccomplishmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter, which Accomplishment to fetch.
     */
    where: AccomplishmentWhereUniqueInput
  }

  /**
   * Accomplishment findFirst
   */
  export type AccomplishmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter, which Accomplishment to fetch.
     */
    where?: AccomplishmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accomplishments to fetch.
     */
    orderBy?: AccomplishmentOrderByWithRelationInput | AccomplishmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accomplishments.
     */
    cursor?: AccomplishmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accomplishments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accomplishments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accomplishments.
     */
    distinct?: AccomplishmentScalarFieldEnum | AccomplishmentScalarFieldEnum[]
  }

  /**
   * Accomplishment findFirstOrThrow
   */
  export type AccomplishmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter, which Accomplishment to fetch.
     */
    where?: AccomplishmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accomplishments to fetch.
     */
    orderBy?: AccomplishmentOrderByWithRelationInput | AccomplishmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accomplishments.
     */
    cursor?: AccomplishmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accomplishments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accomplishments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accomplishments.
     */
    distinct?: AccomplishmentScalarFieldEnum | AccomplishmentScalarFieldEnum[]
  }

  /**
   * Accomplishment findMany
   */
  export type AccomplishmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter, which Accomplishments to fetch.
     */
    where?: AccomplishmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accomplishments to fetch.
     */
    orderBy?: AccomplishmentOrderByWithRelationInput | AccomplishmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accomplishments.
     */
    cursor?: AccomplishmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accomplishments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accomplishments.
     */
    skip?: number
    distinct?: AccomplishmentScalarFieldEnum | AccomplishmentScalarFieldEnum[]
  }

  /**
   * Accomplishment create
   */
  export type AccomplishmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Accomplishment.
     */
    data: XOR<AccomplishmentCreateInput, AccomplishmentUncheckedCreateInput>
  }

  /**
   * Accomplishment createMany
   */
  export type AccomplishmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accomplishments.
     */
    data: AccomplishmentCreateManyInput | AccomplishmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Accomplishment createManyAndReturn
   */
  export type AccomplishmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * The data used to create many Accomplishments.
     */
    data: AccomplishmentCreateManyInput | AccomplishmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Accomplishment update
   */
  export type AccomplishmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Accomplishment.
     */
    data: XOR<AccomplishmentUpdateInput, AccomplishmentUncheckedUpdateInput>
    /**
     * Choose, which Accomplishment to update.
     */
    where: AccomplishmentWhereUniqueInput
  }

  /**
   * Accomplishment updateMany
   */
  export type AccomplishmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accomplishments.
     */
    data: XOR<AccomplishmentUpdateManyMutationInput, AccomplishmentUncheckedUpdateManyInput>
    /**
     * Filter which Accomplishments to update
     */
    where?: AccomplishmentWhereInput
    /**
     * Limit how many Accomplishments to update.
     */
    limit?: number
  }

  /**
   * Accomplishment updateManyAndReturn
   */
  export type AccomplishmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * The data used to update Accomplishments.
     */
    data: XOR<AccomplishmentUpdateManyMutationInput, AccomplishmentUncheckedUpdateManyInput>
    /**
     * Filter which Accomplishments to update
     */
    where?: AccomplishmentWhereInput
    /**
     * Limit how many Accomplishments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Accomplishment upsert
   */
  export type AccomplishmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Accomplishment to update in case it exists.
     */
    where: AccomplishmentWhereUniqueInput
    /**
     * In case the Accomplishment found by the `where` argument doesn't exist, create a new Accomplishment with this data.
     */
    create: XOR<AccomplishmentCreateInput, AccomplishmentUncheckedCreateInput>
    /**
     * In case the Accomplishment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccomplishmentUpdateInput, AccomplishmentUncheckedUpdateInput>
  }

  /**
   * Accomplishment delete
   */
  export type AccomplishmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
    /**
     * Filter which Accomplishment to delete.
     */
    where: AccomplishmentWhereUniqueInput
  }

  /**
   * Accomplishment deleteMany
   */
  export type AccomplishmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accomplishments to delete
     */
    where?: AccomplishmentWhereInput
    /**
     * Limit how many Accomplishments to delete.
     */
    limit?: number
  }

  /**
   * Accomplishment.tags
   */
  export type Accomplishment$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    where?: AccomplishmentTagWhereInput
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    cursor?: AccomplishmentTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccomplishmentTagScalarFieldEnum | AccomplishmentTagScalarFieldEnum[]
  }

  /**
   * Accomplishment without action
   */
  export type AccomplishmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Accomplishment
     */
    select?: AccomplishmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Accomplishment
     */
    omit?: AccomplishmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentInclude<ExtArgs> | null
  }


  /**
   * Model AccomplishmentTag
   */

  export type AggregateAccomplishmentTag = {
    _count: AccomplishmentTagCountAggregateOutputType | null
    _min: AccomplishmentTagMinAggregateOutputType | null
    _max: AccomplishmentTagMaxAggregateOutputType | null
  }

  export type AccomplishmentTagMinAggregateOutputType = {
    id: string | null
    accomplishmentId: string | null
    tagId: string | null
  }

  export type AccomplishmentTagMaxAggregateOutputType = {
    id: string | null
    accomplishmentId: string | null
    tagId: string | null
  }

  export type AccomplishmentTagCountAggregateOutputType = {
    id: number
    accomplishmentId: number
    tagId: number
    _all: number
  }


  export type AccomplishmentTagMinAggregateInputType = {
    id?: true
    accomplishmentId?: true
    tagId?: true
  }

  export type AccomplishmentTagMaxAggregateInputType = {
    id?: true
    accomplishmentId?: true
    tagId?: true
  }

  export type AccomplishmentTagCountAggregateInputType = {
    id?: true
    accomplishmentId?: true
    tagId?: true
    _all?: true
  }

  export type AccomplishmentTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccomplishmentTag to aggregate.
     */
    where?: AccomplishmentTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccomplishmentTags to fetch.
     */
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccomplishmentTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccomplishmentTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccomplishmentTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AccomplishmentTags
    **/
    _count?: true | AccomplishmentTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccomplishmentTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccomplishmentTagMaxAggregateInputType
  }

  export type GetAccomplishmentTagAggregateType<T extends AccomplishmentTagAggregateArgs> = {
        [P in keyof T & keyof AggregateAccomplishmentTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccomplishmentTag[P]>
      : GetScalarType<T[P], AggregateAccomplishmentTag[P]>
  }




  export type AccomplishmentTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccomplishmentTagWhereInput
    orderBy?: AccomplishmentTagOrderByWithAggregationInput | AccomplishmentTagOrderByWithAggregationInput[]
    by: AccomplishmentTagScalarFieldEnum[] | AccomplishmentTagScalarFieldEnum
    having?: AccomplishmentTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccomplishmentTagCountAggregateInputType | true
    _min?: AccomplishmentTagMinAggregateInputType
    _max?: AccomplishmentTagMaxAggregateInputType
  }

  export type AccomplishmentTagGroupByOutputType = {
    id: string
    accomplishmentId: string
    tagId: string
    _count: AccomplishmentTagCountAggregateOutputType | null
    _min: AccomplishmentTagMinAggregateOutputType | null
    _max: AccomplishmentTagMaxAggregateOutputType | null
  }

  type GetAccomplishmentTagGroupByPayload<T extends AccomplishmentTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccomplishmentTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccomplishmentTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccomplishmentTagGroupByOutputType[P]>
            : GetScalarType<T[P], AccomplishmentTagGroupByOutputType[P]>
        }
      >
    >


  export type AccomplishmentTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accomplishmentId?: boolean
    tagId?: boolean
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishmentTag"]>

  export type AccomplishmentTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accomplishmentId?: boolean
    tagId?: boolean
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishmentTag"]>

  export type AccomplishmentTagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accomplishmentId?: boolean
    tagId?: boolean
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["accomplishmentTag"]>

  export type AccomplishmentTagSelectScalar = {
    id?: boolean
    accomplishmentId?: boolean
    tagId?: boolean
  }

  export type AccomplishmentTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accomplishmentId" | "tagId", ExtArgs["result"]["accomplishmentTag"]>
  export type AccomplishmentTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type AccomplishmentTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type AccomplishmentTagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accomplishment?: boolean | AccomplishmentDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }

  export type $AccomplishmentTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AccomplishmentTag"
    objects: {
      accomplishment: Prisma.$AccomplishmentPayload<ExtArgs>
      tag: Prisma.$TagPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accomplishmentId: string
      tagId: string
    }, ExtArgs["result"]["accomplishmentTag"]>
    composites: {}
  }

  type AccomplishmentTagGetPayload<S extends boolean | null | undefined | AccomplishmentTagDefaultArgs> = $Result.GetResult<Prisma.$AccomplishmentTagPayload, S>

  type AccomplishmentTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccomplishmentTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccomplishmentTagCountAggregateInputType | true
    }

  export interface AccomplishmentTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AccomplishmentTag'], meta: { name: 'AccomplishmentTag' } }
    /**
     * Find zero or one AccomplishmentTag that matches the filter.
     * @param {AccomplishmentTagFindUniqueArgs} args - Arguments to find a AccomplishmentTag
     * @example
     * // Get one AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccomplishmentTagFindUniqueArgs>(args: SelectSubset<T, AccomplishmentTagFindUniqueArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AccomplishmentTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccomplishmentTagFindUniqueOrThrowArgs} args - Arguments to find a AccomplishmentTag
     * @example
     * // Get one AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccomplishmentTagFindUniqueOrThrowArgs>(args: SelectSubset<T, AccomplishmentTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccomplishmentTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagFindFirstArgs} args - Arguments to find a AccomplishmentTag
     * @example
     * // Get one AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccomplishmentTagFindFirstArgs>(args?: SelectSubset<T, AccomplishmentTagFindFirstArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AccomplishmentTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagFindFirstOrThrowArgs} args - Arguments to find a AccomplishmentTag
     * @example
     * // Get one AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccomplishmentTagFindFirstOrThrowArgs>(args?: SelectSubset<T, AccomplishmentTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AccomplishmentTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AccomplishmentTags
     * const accomplishmentTags = await prisma.accomplishmentTag.findMany()
     * 
     * // Get first 10 AccomplishmentTags
     * const accomplishmentTags = await prisma.accomplishmentTag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accomplishmentTagWithIdOnly = await prisma.accomplishmentTag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccomplishmentTagFindManyArgs>(args?: SelectSubset<T, AccomplishmentTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AccomplishmentTag.
     * @param {AccomplishmentTagCreateArgs} args - Arguments to create a AccomplishmentTag.
     * @example
     * // Create one AccomplishmentTag
     * const AccomplishmentTag = await prisma.accomplishmentTag.create({
     *   data: {
     *     // ... data to create a AccomplishmentTag
     *   }
     * })
     * 
     */
    create<T extends AccomplishmentTagCreateArgs>(args: SelectSubset<T, AccomplishmentTagCreateArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AccomplishmentTags.
     * @param {AccomplishmentTagCreateManyArgs} args - Arguments to create many AccomplishmentTags.
     * @example
     * // Create many AccomplishmentTags
     * const accomplishmentTag = await prisma.accomplishmentTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccomplishmentTagCreateManyArgs>(args?: SelectSubset<T, AccomplishmentTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AccomplishmentTags and returns the data saved in the database.
     * @param {AccomplishmentTagCreateManyAndReturnArgs} args - Arguments to create many AccomplishmentTags.
     * @example
     * // Create many AccomplishmentTags
     * const accomplishmentTag = await prisma.accomplishmentTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AccomplishmentTags and only return the `id`
     * const accomplishmentTagWithIdOnly = await prisma.accomplishmentTag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccomplishmentTagCreateManyAndReturnArgs>(args?: SelectSubset<T, AccomplishmentTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AccomplishmentTag.
     * @param {AccomplishmentTagDeleteArgs} args - Arguments to delete one AccomplishmentTag.
     * @example
     * // Delete one AccomplishmentTag
     * const AccomplishmentTag = await prisma.accomplishmentTag.delete({
     *   where: {
     *     // ... filter to delete one AccomplishmentTag
     *   }
     * })
     * 
     */
    delete<T extends AccomplishmentTagDeleteArgs>(args: SelectSubset<T, AccomplishmentTagDeleteArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AccomplishmentTag.
     * @param {AccomplishmentTagUpdateArgs} args - Arguments to update one AccomplishmentTag.
     * @example
     * // Update one AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccomplishmentTagUpdateArgs>(args: SelectSubset<T, AccomplishmentTagUpdateArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AccomplishmentTags.
     * @param {AccomplishmentTagDeleteManyArgs} args - Arguments to filter AccomplishmentTags to delete.
     * @example
     * // Delete a few AccomplishmentTags
     * const { count } = await prisma.accomplishmentTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccomplishmentTagDeleteManyArgs>(args?: SelectSubset<T, AccomplishmentTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccomplishmentTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AccomplishmentTags
     * const accomplishmentTag = await prisma.accomplishmentTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccomplishmentTagUpdateManyArgs>(args: SelectSubset<T, AccomplishmentTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AccomplishmentTags and returns the data updated in the database.
     * @param {AccomplishmentTagUpdateManyAndReturnArgs} args - Arguments to update many AccomplishmentTags.
     * @example
     * // Update many AccomplishmentTags
     * const accomplishmentTag = await prisma.accomplishmentTag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AccomplishmentTags and only return the `id`
     * const accomplishmentTagWithIdOnly = await prisma.accomplishmentTag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccomplishmentTagUpdateManyAndReturnArgs>(args: SelectSubset<T, AccomplishmentTagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AccomplishmentTag.
     * @param {AccomplishmentTagUpsertArgs} args - Arguments to update or create a AccomplishmentTag.
     * @example
     * // Update or create a AccomplishmentTag
     * const accomplishmentTag = await prisma.accomplishmentTag.upsert({
     *   create: {
     *     // ... data to create a AccomplishmentTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AccomplishmentTag we want to update
     *   }
     * })
     */
    upsert<T extends AccomplishmentTagUpsertArgs>(args: SelectSubset<T, AccomplishmentTagUpsertArgs<ExtArgs>>): Prisma__AccomplishmentTagClient<$Result.GetResult<Prisma.$AccomplishmentTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AccomplishmentTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagCountArgs} args - Arguments to filter AccomplishmentTags to count.
     * @example
     * // Count the number of AccomplishmentTags
     * const count = await prisma.accomplishmentTag.count({
     *   where: {
     *     // ... the filter for the AccomplishmentTags we want to count
     *   }
     * })
    **/
    count<T extends AccomplishmentTagCountArgs>(
      args?: Subset<T, AccomplishmentTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccomplishmentTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AccomplishmentTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccomplishmentTagAggregateArgs>(args: Subset<T, AccomplishmentTagAggregateArgs>): Prisma.PrismaPromise<GetAccomplishmentTagAggregateType<T>>

    /**
     * Group by AccomplishmentTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccomplishmentTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccomplishmentTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccomplishmentTagGroupByArgs['orderBy'] }
        : { orderBy?: AccomplishmentTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccomplishmentTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccomplishmentTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AccomplishmentTag model
   */
  readonly fields: AccomplishmentTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AccomplishmentTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccomplishmentTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accomplishment<T extends AccomplishmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccomplishmentDefaultArgs<ExtArgs>>): Prisma__AccomplishmentClient<$Result.GetResult<Prisma.$AccomplishmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AccomplishmentTag model
   */
  interface AccomplishmentTagFieldRefs {
    readonly id: FieldRef<"AccomplishmentTag", 'String'>
    readonly accomplishmentId: FieldRef<"AccomplishmentTag", 'String'>
    readonly tagId: FieldRef<"AccomplishmentTag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AccomplishmentTag findUnique
   */
  export type AccomplishmentTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter, which AccomplishmentTag to fetch.
     */
    where: AccomplishmentTagWhereUniqueInput
  }

  /**
   * AccomplishmentTag findUniqueOrThrow
   */
  export type AccomplishmentTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter, which AccomplishmentTag to fetch.
     */
    where: AccomplishmentTagWhereUniqueInput
  }

  /**
   * AccomplishmentTag findFirst
   */
  export type AccomplishmentTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter, which AccomplishmentTag to fetch.
     */
    where?: AccomplishmentTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccomplishmentTags to fetch.
     */
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccomplishmentTags.
     */
    cursor?: AccomplishmentTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccomplishmentTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccomplishmentTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccomplishmentTags.
     */
    distinct?: AccomplishmentTagScalarFieldEnum | AccomplishmentTagScalarFieldEnum[]
  }

  /**
   * AccomplishmentTag findFirstOrThrow
   */
  export type AccomplishmentTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter, which AccomplishmentTag to fetch.
     */
    where?: AccomplishmentTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccomplishmentTags to fetch.
     */
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AccomplishmentTags.
     */
    cursor?: AccomplishmentTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccomplishmentTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccomplishmentTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AccomplishmentTags.
     */
    distinct?: AccomplishmentTagScalarFieldEnum | AccomplishmentTagScalarFieldEnum[]
  }

  /**
   * AccomplishmentTag findMany
   */
  export type AccomplishmentTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter, which AccomplishmentTags to fetch.
     */
    where?: AccomplishmentTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AccomplishmentTags to fetch.
     */
    orderBy?: AccomplishmentTagOrderByWithRelationInput | AccomplishmentTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AccomplishmentTags.
     */
    cursor?: AccomplishmentTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AccomplishmentTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AccomplishmentTags.
     */
    skip?: number
    distinct?: AccomplishmentTagScalarFieldEnum | AccomplishmentTagScalarFieldEnum[]
  }

  /**
   * AccomplishmentTag create
   */
  export type AccomplishmentTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * The data needed to create a AccomplishmentTag.
     */
    data: XOR<AccomplishmentTagCreateInput, AccomplishmentTagUncheckedCreateInput>
  }

  /**
   * AccomplishmentTag createMany
   */
  export type AccomplishmentTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AccomplishmentTags.
     */
    data: AccomplishmentTagCreateManyInput | AccomplishmentTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AccomplishmentTag createManyAndReturn
   */
  export type AccomplishmentTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * The data used to create many AccomplishmentTags.
     */
    data: AccomplishmentTagCreateManyInput | AccomplishmentTagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccomplishmentTag update
   */
  export type AccomplishmentTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * The data needed to update a AccomplishmentTag.
     */
    data: XOR<AccomplishmentTagUpdateInput, AccomplishmentTagUncheckedUpdateInput>
    /**
     * Choose, which AccomplishmentTag to update.
     */
    where: AccomplishmentTagWhereUniqueInput
  }

  /**
   * AccomplishmentTag updateMany
   */
  export type AccomplishmentTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AccomplishmentTags.
     */
    data: XOR<AccomplishmentTagUpdateManyMutationInput, AccomplishmentTagUncheckedUpdateManyInput>
    /**
     * Filter which AccomplishmentTags to update
     */
    where?: AccomplishmentTagWhereInput
    /**
     * Limit how many AccomplishmentTags to update.
     */
    limit?: number
  }

  /**
   * AccomplishmentTag updateManyAndReturn
   */
  export type AccomplishmentTagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * The data used to update AccomplishmentTags.
     */
    data: XOR<AccomplishmentTagUpdateManyMutationInput, AccomplishmentTagUncheckedUpdateManyInput>
    /**
     * Filter which AccomplishmentTags to update
     */
    where?: AccomplishmentTagWhereInput
    /**
     * Limit how many AccomplishmentTags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AccomplishmentTag upsert
   */
  export type AccomplishmentTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * The filter to search for the AccomplishmentTag to update in case it exists.
     */
    where: AccomplishmentTagWhereUniqueInput
    /**
     * In case the AccomplishmentTag found by the `where` argument doesn't exist, create a new AccomplishmentTag with this data.
     */
    create: XOR<AccomplishmentTagCreateInput, AccomplishmentTagUncheckedCreateInput>
    /**
     * In case the AccomplishmentTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccomplishmentTagUpdateInput, AccomplishmentTagUncheckedUpdateInput>
  }

  /**
   * AccomplishmentTag delete
   */
  export type AccomplishmentTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
    /**
     * Filter which AccomplishmentTag to delete.
     */
    where: AccomplishmentTagWhereUniqueInput
  }

  /**
   * AccomplishmentTag deleteMany
   */
  export type AccomplishmentTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AccomplishmentTags to delete
     */
    where?: AccomplishmentTagWhereInput
    /**
     * Limit how many AccomplishmentTags to delete.
     */
    limit?: number
  }

  /**
   * AccomplishmentTag without action
   */
  export type AccomplishmentTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccomplishmentTag
     */
    select?: AccomplishmentTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AccomplishmentTag
     */
    omit?: AccomplishmentTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccomplishmentTagInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const AccomplishmentScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    date: 'date',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccomplishmentScalarFieldEnum = (typeof AccomplishmentScalarFieldEnum)[keyof typeof AccomplishmentScalarFieldEnum]


  export const AccomplishmentTagScalarFieldEnum: {
    id: 'id',
    accomplishmentId: 'accomplishmentId',
    tagId: 'tagId'
  };

  export type AccomplishmentTagScalarFieldEnum = (typeof AccomplishmentTagScalarFieldEnum)[keyof typeof AccomplishmentTagScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: StringFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    description?: StringNullableFilter<"Category"> | string | null
    color?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    accomplishments?: AccomplishmentListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accomplishments?: AccomplishmentOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    description?: StringNullableFilter<"Category"> | string | null
    color?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    accomplishments?: AccomplishmentListRelationFilter
  }, "id" | "name">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    description?: StringNullableWithAggregatesFilter<"Category"> | string | null
    color?: StringNullableWithAggregatesFilter<"Category"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: StringFilter<"Tag"> | string
    name?: StringFilter<"Tag"> | string
    description?: StringNullableFilter<"Tag"> | string | null
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    accomplishments?: AccomplishmentTagListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accomplishments?: AccomplishmentTagOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    description?: StringNullableFilter<"Tag"> | string | null
    color?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    accomplishments?: AccomplishmentTagListRelationFilter
  }, "id" | "name">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tag"> | string
    name?: StringWithAggregatesFilter<"Tag"> | string
    description?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    color?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
  }

  export type AccomplishmentWhereInput = {
    AND?: AccomplishmentWhereInput | AccomplishmentWhereInput[]
    OR?: AccomplishmentWhereInput[]
    NOT?: AccomplishmentWhereInput | AccomplishmentWhereInput[]
    id?: StringFilter<"Accomplishment"> | string
    title?: StringFilter<"Accomplishment"> | string
    description?: StringNullableFilter<"Accomplishment"> | string | null
    date?: DateTimeFilter<"Accomplishment"> | Date | string
    categoryId?: StringFilter<"Accomplishment"> | string
    createdAt?: DateTimeFilter<"Accomplishment"> | Date | string
    updatedAt?: DateTimeFilter<"Accomplishment"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
    tags?: AccomplishmentTagListRelationFilter
  }

  export type AccomplishmentOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    tags?: AccomplishmentTagOrderByRelationAggregateInput
  }

  export type AccomplishmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccomplishmentWhereInput | AccomplishmentWhereInput[]
    OR?: AccomplishmentWhereInput[]
    NOT?: AccomplishmentWhereInput | AccomplishmentWhereInput[]
    title?: StringFilter<"Accomplishment"> | string
    description?: StringNullableFilter<"Accomplishment"> | string | null
    date?: DateTimeFilter<"Accomplishment"> | Date | string
    categoryId?: StringFilter<"Accomplishment"> | string
    createdAt?: DateTimeFilter<"Accomplishment"> | Date | string
    updatedAt?: DateTimeFilter<"Accomplishment"> | Date | string
    category?: XOR<CategoryScalarRelationFilter, CategoryWhereInput>
    tags?: AccomplishmentTagListRelationFilter
  }, "id">

  export type AccomplishmentOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    date?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccomplishmentCountOrderByAggregateInput
    _max?: AccomplishmentMaxOrderByAggregateInput
    _min?: AccomplishmentMinOrderByAggregateInput
  }

  export type AccomplishmentScalarWhereWithAggregatesInput = {
    AND?: AccomplishmentScalarWhereWithAggregatesInput | AccomplishmentScalarWhereWithAggregatesInput[]
    OR?: AccomplishmentScalarWhereWithAggregatesInput[]
    NOT?: AccomplishmentScalarWhereWithAggregatesInput | AccomplishmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Accomplishment"> | string
    title?: StringWithAggregatesFilter<"Accomplishment"> | string
    description?: StringNullableWithAggregatesFilter<"Accomplishment"> | string | null
    date?: DateTimeWithAggregatesFilter<"Accomplishment"> | Date | string
    categoryId?: StringWithAggregatesFilter<"Accomplishment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Accomplishment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Accomplishment"> | Date | string
  }

  export type AccomplishmentTagWhereInput = {
    AND?: AccomplishmentTagWhereInput | AccomplishmentTagWhereInput[]
    OR?: AccomplishmentTagWhereInput[]
    NOT?: AccomplishmentTagWhereInput | AccomplishmentTagWhereInput[]
    id?: StringFilter<"AccomplishmentTag"> | string
    accomplishmentId?: StringFilter<"AccomplishmentTag"> | string
    tagId?: StringFilter<"AccomplishmentTag"> | string
    accomplishment?: XOR<AccomplishmentScalarRelationFilter, AccomplishmentWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }

  export type AccomplishmentTagOrderByWithRelationInput = {
    id?: SortOrder
    accomplishmentId?: SortOrder
    tagId?: SortOrder
    accomplishment?: AccomplishmentOrderByWithRelationInput
    tag?: TagOrderByWithRelationInput
  }

  export type AccomplishmentTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accomplishmentId_tagId?: AccomplishmentTagAccomplishmentIdTagIdCompoundUniqueInput
    AND?: AccomplishmentTagWhereInput | AccomplishmentTagWhereInput[]
    OR?: AccomplishmentTagWhereInput[]
    NOT?: AccomplishmentTagWhereInput | AccomplishmentTagWhereInput[]
    accomplishmentId?: StringFilter<"AccomplishmentTag"> | string
    tagId?: StringFilter<"AccomplishmentTag"> | string
    accomplishment?: XOR<AccomplishmentScalarRelationFilter, AccomplishmentWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }, "id" | "accomplishmentId_tagId">

  export type AccomplishmentTagOrderByWithAggregationInput = {
    id?: SortOrder
    accomplishmentId?: SortOrder
    tagId?: SortOrder
    _count?: AccomplishmentTagCountOrderByAggregateInput
    _max?: AccomplishmentTagMaxOrderByAggregateInput
    _min?: AccomplishmentTagMinOrderByAggregateInput
  }

  export type AccomplishmentTagScalarWhereWithAggregatesInput = {
    AND?: AccomplishmentTagScalarWhereWithAggregatesInput | AccomplishmentTagScalarWhereWithAggregatesInput[]
    OR?: AccomplishmentTagScalarWhereWithAggregatesInput[]
    NOT?: AccomplishmentTagScalarWhereWithAggregatesInput | AccomplishmentTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AccomplishmentTag"> | string
    accomplishmentId?: StringWithAggregatesFilter<"AccomplishmentTag"> | string
    tagId?: StringWithAggregatesFilter<"AccomplishmentTag"> | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accomplishments?: AccomplishmentCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accomplishments?: AccomplishmentUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accomplishments?: AccomplishmentUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accomplishments?: AccomplishmentUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accomplishments?: AccomplishmentTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accomplishments?: AccomplishmentTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accomplishments?: AccomplishmentTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accomplishments?: AccomplishmentTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentCreateInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutAccomplishmentsInput
    tags?: AccomplishmentTagCreateNestedManyWithoutAccomplishmentInput
  }

  export type AccomplishmentUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: AccomplishmentTagUncheckedCreateNestedManyWithoutAccomplishmentInput
  }

  export type AccomplishmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutAccomplishmentsNestedInput
    tags?: AccomplishmentTagUpdateManyWithoutAccomplishmentNestedInput
  }

  export type AccomplishmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: AccomplishmentTagUncheckedUpdateManyWithoutAccomplishmentNestedInput
  }

  export type AccomplishmentCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccomplishmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentTagCreateInput = {
    id?: string
    accomplishment: AccomplishmentCreateNestedOneWithoutTagsInput
    tag: TagCreateNestedOneWithoutAccomplishmentsInput
  }

  export type AccomplishmentTagUncheckedCreateInput = {
    id?: string
    accomplishmentId: string
    tagId: string
  }

  export type AccomplishmentTagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishment?: AccomplishmentUpdateOneRequiredWithoutTagsNestedInput
    tag?: TagUpdateOneRequiredWithoutAccomplishmentsNestedInput
  }

  export type AccomplishmentTagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishmentId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type AccomplishmentTagCreateManyInput = {
    id?: string
    accomplishmentId: string
    tagId: string
  }

  export type AccomplishmentTagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type AccomplishmentTagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishmentId?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccomplishmentListRelationFilter = {
    every?: AccomplishmentWhereInput
    some?: AccomplishmentWhereInput
    none?: AccomplishmentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccomplishmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AccomplishmentTagListRelationFilter = {
    every?: AccomplishmentTagWhereInput
    some?: AccomplishmentTagWhereInput
    none?: AccomplishmentTagWhereInput
  }

  export type AccomplishmentTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CategoryScalarRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type AccomplishmentCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccomplishmentMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccomplishmentMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccomplishmentScalarRelationFilter = {
    is?: AccomplishmentWhereInput
    isNot?: AccomplishmentWhereInput
  }

  export type TagScalarRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type AccomplishmentTagAccomplishmentIdTagIdCompoundUniqueInput = {
    accomplishmentId: string
    tagId: string
  }

  export type AccomplishmentTagCountOrderByAggregateInput = {
    id?: SortOrder
    accomplishmentId?: SortOrder
    tagId?: SortOrder
  }

  export type AccomplishmentTagMaxOrderByAggregateInput = {
    id?: SortOrder
    accomplishmentId?: SortOrder
    tagId?: SortOrder
  }

  export type AccomplishmentTagMinOrderByAggregateInput = {
    id?: SortOrder
    accomplishmentId?: SortOrder
    tagId?: SortOrder
  }

  export type AccomplishmentCreateNestedManyWithoutCategoryInput = {
    create?: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput> | AccomplishmentCreateWithoutCategoryInput[] | AccomplishmentUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutCategoryInput | AccomplishmentCreateOrConnectWithoutCategoryInput[]
    createMany?: AccomplishmentCreateManyCategoryInputEnvelope
    connect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
  }

  export type AccomplishmentUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput> | AccomplishmentCreateWithoutCategoryInput[] | AccomplishmentUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutCategoryInput | AccomplishmentCreateOrConnectWithoutCategoryInput[]
    createMany?: AccomplishmentCreateManyCategoryInputEnvelope
    connect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccomplishmentUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput> | AccomplishmentCreateWithoutCategoryInput[] | AccomplishmentUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutCategoryInput | AccomplishmentCreateOrConnectWithoutCategoryInput[]
    upsert?: AccomplishmentUpsertWithWhereUniqueWithoutCategoryInput | AccomplishmentUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: AccomplishmentCreateManyCategoryInputEnvelope
    set?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    disconnect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    delete?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    connect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    update?: AccomplishmentUpdateWithWhereUniqueWithoutCategoryInput | AccomplishmentUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: AccomplishmentUpdateManyWithWhereWithoutCategoryInput | AccomplishmentUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: AccomplishmentScalarWhereInput | AccomplishmentScalarWhereInput[]
  }

  export type AccomplishmentUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput> | AccomplishmentCreateWithoutCategoryInput[] | AccomplishmentUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutCategoryInput | AccomplishmentCreateOrConnectWithoutCategoryInput[]
    upsert?: AccomplishmentUpsertWithWhereUniqueWithoutCategoryInput | AccomplishmentUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: AccomplishmentCreateManyCategoryInputEnvelope
    set?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    disconnect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    delete?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    connect?: AccomplishmentWhereUniqueInput | AccomplishmentWhereUniqueInput[]
    update?: AccomplishmentUpdateWithWhereUniqueWithoutCategoryInput | AccomplishmentUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: AccomplishmentUpdateManyWithWhereWithoutCategoryInput | AccomplishmentUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: AccomplishmentScalarWhereInput | AccomplishmentScalarWhereInput[]
  }

  export type AccomplishmentTagCreateNestedManyWithoutTagInput = {
    create?: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput> | AccomplishmentTagCreateWithoutTagInput[] | AccomplishmentTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutTagInput | AccomplishmentTagCreateOrConnectWithoutTagInput[]
    createMany?: AccomplishmentTagCreateManyTagInputEnvelope
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
  }

  export type AccomplishmentTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput> | AccomplishmentTagCreateWithoutTagInput[] | AccomplishmentTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutTagInput | AccomplishmentTagCreateOrConnectWithoutTagInput[]
    createMany?: AccomplishmentTagCreateManyTagInputEnvelope
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
  }

  export type AccomplishmentTagUpdateManyWithoutTagNestedInput = {
    create?: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput> | AccomplishmentTagCreateWithoutTagInput[] | AccomplishmentTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutTagInput | AccomplishmentTagCreateOrConnectWithoutTagInput[]
    upsert?: AccomplishmentTagUpsertWithWhereUniqueWithoutTagInput | AccomplishmentTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: AccomplishmentTagCreateManyTagInputEnvelope
    set?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    disconnect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    delete?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    update?: AccomplishmentTagUpdateWithWhereUniqueWithoutTagInput | AccomplishmentTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: AccomplishmentTagUpdateManyWithWhereWithoutTagInput | AccomplishmentTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
  }

  export type AccomplishmentTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput> | AccomplishmentTagCreateWithoutTagInput[] | AccomplishmentTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutTagInput | AccomplishmentTagCreateOrConnectWithoutTagInput[]
    upsert?: AccomplishmentTagUpsertWithWhereUniqueWithoutTagInput | AccomplishmentTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: AccomplishmentTagCreateManyTagInputEnvelope
    set?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    disconnect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    delete?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    update?: AccomplishmentTagUpdateWithWhereUniqueWithoutTagInput | AccomplishmentTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: AccomplishmentTagUpdateManyWithWhereWithoutTagInput | AccomplishmentTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutAccomplishmentsInput = {
    create?: XOR<CategoryCreateWithoutAccomplishmentsInput, CategoryUncheckedCreateWithoutAccomplishmentsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutAccomplishmentsInput
    connect?: CategoryWhereUniqueInput
  }

  export type AccomplishmentTagCreateNestedManyWithoutAccomplishmentInput = {
    create?: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput> | AccomplishmentTagCreateWithoutAccomplishmentInput[] | AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput | AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput[]
    createMany?: AccomplishmentTagCreateManyAccomplishmentInputEnvelope
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
  }

  export type AccomplishmentTagUncheckedCreateNestedManyWithoutAccomplishmentInput = {
    create?: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput> | AccomplishmentTagCreateWithoutAccomplishmentInput[] | AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput | AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput[]
    createMany?: AccomplishmentTagCreateManyAccomplishmentInputEnvelope
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
  }

  export type CategoryUpdateOneRequiredWithoutAccomplishmentsNestedInput = {
    create?: XOR<CategoryCreateWithoutAccomplishmentsInput, CategoryUncheckedCreateWithoutAccomplishmentsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutAccomplishmentsInput
    upsert?: CategoryUpsertWithoutAccomplishmentsInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutAccomplishmentsInput, CategoryUpdateWithoutAccomplishmentsInput>, CategoryUncheckedUpdateWithoutAccomplishmentsInput>
  }

  export type AccomplishmentTagUpdateManyWithoutAccomplishmentNestedInput = {
    create?: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput> | AccomplishmentTagCreateWithoutAccomplishmentInput[] | AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput | AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput[]
    upsert?: AccomplishmentTagUpsertWithWhereUniqueWithoutAccomplishmentInput | AccomplishmentTagUpsertWithWhereUniqueWithoutAccomplishmentInput[]
    createMany?: AccomplishmentTagCreateManyAccomplishmentInputEnvelope
    set?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    disconnect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    delete?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    update?: AccomplishmentTagUpdateWithWhereUniqueWithoutAccomplishmentInput | AccomplishmentTagUpdateWithWhereUniqueWithoutAccomplishmentInput[]
    updateMany?: AccomplishmentTagUpdateManyWithWhereWithoutAccomplishmentInput | AccomplishmentTagUpdateManyWithWhereWithoutAccomplishmentInput[]
    deleteMany?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
  }

  export type AccomplishmentTagUncheckedUpdateManyWithoutAccomplishmentNestedInput = {
    create?: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput> | AccomplishmentTagCreateWithoutAccomplishmentInput[] | AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput[]
    connectOrCreate?: AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput | AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput[]
    upsert?: AccomplishmentTagUpsertWithWhereUniqueWithoutAccomplishmentInput | AccomplishmentTagUpsertWithWhereUniqueWithoutAccomplishmentInput[]
    createMany?: AccomplishmentTagCreateManyAccomplishmentInputEnvelope
    set?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    disconnect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    delete?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    connect?: AccomplishmentTagWhereUniqueInput | AccomplishmentTagWhereUniqueInput[]
    update?: AccomplishmentTagUpdateWithWhereUniqueWithoutAccomplishmentInput | AccomplishmentTagUpdateWithWhereUniqueWithoutAccomplishmentInput[]
    updateMany?: AccomplishmentTagUpdateManyWithWhereWithoutAccomplishmentInput | AccomplishmentTagUpdateManyWithWhereWithoutAccomplishmentInput[]
    deleteMany?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
  }

  export type AccomplishmentCreateNestedOneWithoutTagsInput = {
    create?: XOR<AccomplishmentCreateWithoutTagsInput, AccomplishmentUncheckedCreateWithoutTagsInput>
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutTagsInput
    connect?: AccomplishmentWhereUniqueInput
  }

  export type TagCreateNestedOneWithoutAccomplishmentsInput = {
    create?: XOR<TagCreateWithoutAccomplishmentsInput, TagUncheckedCreateWithoutAccomplishmentsInput>
    connectOrCreate?: TagCreateOrConnectWithoutAccomplishmentsInput
    connect?: TagWhereUniqueInput
  }

  export type AccomplishmentUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<AccomplishmentCreateWithoutTagsInput, AccomplishmentUncheckedCreateWithoutTagsInput>
    connectOrCreate?: AccomplishmentCreateOrConnectWithoutTagsInput
    upsert?: AccomplishmentUpsertWithoutTagsInput
    connect?: AccomplishmentWhereUniqueInput
    update?: XOR<XOR<AccomplishmentUpdateToOneWithWhereWithoutTagsInput, AccomplishmentUpdateWithoutTagsInput>, AccomplishmentUncheckedUpdateWithoutTagsInput>
  }

  export type TagUpdateOneRequiredWithoutAccomplishmentsNestedInput = {
    create?: XOR<TagCreateWithoutAccomplishmentsInput, TagUncheckedCreateWithoutAccomplishmentsInput>
    connectOrCreate?: TagCreateOrConnectWithoutAccomplishmentsInput
    upsert?: TagUpsertWithoutAccomplishmentsInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutAccomplishmentsInput, TagUpdateWithoutAccomplishmentsInput>, TagUncheckedUpdateWithoutAccomplishmentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type AccomplishmentCreateWithoutCategoryInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: AccomplishmentTagCreateNestedManyWithoutAccomplishmentInput
  }

  export type AccomplishmentUncheckedCreateWithoutCategoryInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    tags?: AccomplishmentTagUncheckedCreateNestedManyWithoutAccomplishmentInput
  }

  export type AccomplishmentCreateOrConnectWithoutCategoryInput = {
    where: AccomplishmentWhereUniqueInput
    create: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput>
  }

  export type AccomplishmentCreateManyCategoryInputEnvelope = {
    data: AccomplishmentCreateManyCategoryInput | AccomplishmentCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type AccomplishmentUpsertWithWhereUniqueWithoutCategoryInput = {
    where: AccomplishmentWhereUniqueInput
    update: XOR<AccomplishmentUpdateWithoutCategoryInput, AccomplishmentUncheckedUpdateWithoutCategoryInput>
    create: XOR<AccomplishmentCreateWithoutCategoryInput, AccomplishmentUncheckedCreateWithoutCategoryInput>
  }

  export type AccomplishmentUpdateWithWhereUniqueWithoutCategoryInput = {
    where: AccomplishmentWhereUniqueInput
    data: XOR<AccomplishmentUpdateWithoutCategoryInput, AccomplishmentUncheckedUpdateWithoutCategoryInput>
  }

  export type AccomplishmentUpdateManyWithWhereWithoutCategoryInput = {
    where: AccomplishmentScalarWhereInput
    data: XOR<AccomplishmentUpdateManyMutationInput, AccomplishmentUncheckedUpdateManyWithoutCategoryInput>
  }

  export type AccomplishmentScalarWhereInput = {
    AND?: AccomplishmentScalarWhereInput | AccomplishmentScalarWhereInput[]
    OR?: AccomplishmentScalarWhereInput[]
    NOT?: AccomplishmentScalarWhereInput | AccomplishmentScalarWhereInput[]
    id?: StringFilter<"Accomplishment"> | string
    title?: StringFilter<"Accomplishment"> | string
    description?: StringNullableFilter<"Accomplishment"> | string | null
    date?: DateTimeFilter<"Accomplishment"> | Date | string
    categoryId?: StringFilter<"Accomplishment"> | string
    createdAt?: DateTimeFilter<"Accomplishment"> | Date | string
    updatedAt?: DateTimeFilter<"Accomplishment"> | Date | string
  }

  export type AccomplishmentTagCreateWithoutTagInput = {
    id?: string
    accomplishment: AccomplishmentCreateNestedOneWithoutTagsInput
  }

  export type AccomplishmentTagUncheckedCreateWithoutTagInput = {
    id?: string
    accomplishmentId: string
  }

  export type AccomplishmentTagCreateOrConnectWithoutTagInput = {
    where: AccomplishmentTagWhereUniqueInput
    create: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput>
  }

  export type AccomplishmentTagCreateManyTagInputEnvelope = {
    data: AccomplishmentTagCreateManyTagInput | AccomplishmentTagCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type AccomplishmentTagUpsertWithWhereUniqueWithoutTagInput = {
    where: AccomplishmentTagWhereUniqueInput
    update: XOR<AccomplishmentTagUpdateWithoutTagInput, AccomplishmentTagUncheckedUpdateWithoutTagInput>
    create: XOR<AccomplishmentTagCreateWithoutTagInput, AccomplishmentTagUncheckedCreateWithoutTagInput>
  }

  export type AccomplishmentTagUpdateWithWhereUniqueWithoutTagInput = {
    where: AccomplishmentTagWhereUniqueInput
    data: XOR<AccomplishmentTagUpdateWithoutTagInput, AccomplishmentTagUncheckedUpdateWithoutTagInput>
  }

  export type AccomplishmentTagUpdateManyWithWhereWithoutTagInput = {
    where: AccomplishmentTagScalarWhereInput
    data: XOR<AccomplishmentTagUpdateManyMutationInput, AccomplishmentTagUncheckedUpdateManyWithoutTagInput>
  }

  export type AccomplishmentTagScalarWhereInput = {
    AND?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
    OR?: AccomplishmentTagScalarWhereInput[]
    NOT?: AccomplishmentTagScalarWhereInput | AccomplishmentTagScalarWhereInput[]
    id?: StringFilter<"AccomplishmentTag"> | string
    accomplishmentId?: StringFilter<"AccomplishmentTag"> | string
    tagId?: StringFilter<"AccomplishmentTag"> | string
  }

  export type CategoryCreateWithoutAccomplishmentsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryUncheckedCreateWithoutAccomplishmentsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CategoryCreateOrConnectWithoutAccomplishmentsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutAccomplishmentsInput, CategoryUncheckedCreateWithoutAccomplishmentsInput>
  }

  export type AccomplishmentTagCreateWithoutAccomplishmentInput = {
    id?: string
    tag: TagCreateNestedOneWithoutAccomplishmentsInput
  }

  export type AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput = {
    id?: string
    tagId: string
  }

  export type AccomplishmentTagCreateOrConnectWithoutAccomplishmentInput = {
    where: AccomplishmentTagWhereUniqueInput
    create: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput>
  }

  export type AccomplishmentTagCreateManyAccomplishmentInputEnvelope = {
    data: AccomplishmentTagCreateManyAccomplishmentInput | AccomplishmentTagCreateManyAccomplishmentInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutAccomplishmentsInput = {
    update: XOR<CategoryUpdateWithoutAccomplishmentsInput, CategoryUncheckedUpdateWithoutAccomplishmentsInput>
    create: XOR<CategoryCreateWithoutAccomplishmentsInput, CategoryUncheckedCreateWithoutAccomplishmentsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutAccomplishmentsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutAccomplishmentsInput, CategoryUncheckedUpdateWithoutAccomplishmentsInput>
  }

  export type CategoryUpdateWithoutAccomplishmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutAccomplishmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentTagUpsertWithWhereUniqueWithoutAccomplishmentInput = {
    where: AccomplishmentTagWhereUniqueInput
    update: XOR<AccomplishmentTagUpdateWithoutAccomplishmentInput, AccomplishmentTagUncheckedUpdateWithoutAccomplishmentInput>
    create: XOR<AccomplishmentTagCreateWithoutAccomplishmentInput, AccomplishmentTagUncheckedCreateWithoutAccomplishmentInput>
  }

  export type AccomplishmentTagUpdateWithWhereUniqueWithoutAccomplishmentInput = {
    where: AccomplishmentTagWhereUniqueInput
    data: XOR<AccomplishmentTagUpdateWithoutAccomplishmentInput, AccomplishmentTagUncheckedUpdateWithoutAccomplishmentInput>
  }

  export type AccomplishmentTagUpdateManyWithWhereWithoutAccomplishmentInput = {
    where: AccomplishmentTagScalarWhereInput
    data: XOR<AccomplishmentTagUpdateManyMutationInput, AccomplishmentTagUncheckedUpdateManyWithoutAccomplishmentInput>
  }

  export type AccomplishmentCreateWithoutTagsInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    category: CategoryCreateNestedOneWithoutAccomplishmentsInput
  }

  export type AccomplishmentUncheckedCreateWithoutTagsInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    categoryId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccomplishmentCreateOrConnectWithoutTagsInput = {
    where: AccomplishmentWhereUniqueInput
    create: XOR<AccomplishmentCreateWithoutTagsInput, AccomplishmentUncheckedCreateWithoutTagsInput>
  }

  export type TagCreateWithoutAccomplishmentsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagUncheckedCreateWithoutAccomplishmentsInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagCreateOrConnectWithoutAccomplishmentsInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutAccomplishmentsInput, TagUncheckedCreateWithoutAccomplishmentsInput>
  }

  export type AccomplishmentUpsertWithoutTagsInput = {
    update: XOR<AccomplishmentUpdateWithoutTagsInput, AccomplishmentUncheckedUpdateWithoutTagsInput>
    create: XOR<AccomplishmentCreateWithoutTagsInput, AccomplishmentUncheckedCreateWithoutTagsInput>
    where?: AccomplishmentWhereInput
  }

  export type AccomplishmentUpdateToOneWithWhereWithoutTagsInput = {
    where?: AccomplishmentWhereInput
    data: XOR<AccomplishmentUpdateWithoutTagsInput, AccomplishmentUncheckedUpdateWithoutTagsInput>
  }

  export type AccomplishmentUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutAccomplishmentsNestedInput
  }

  export type AccomplishmentUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUpsertWithoutAccomplishmentsInput = {
    update: XOR<TagUpdateWithoutAccomplishmentsInput, TagUncheckedUpdateWithoutAccomplishmentsInput>
    create: XOR<TagCreateWithoutAccomplishmentsInput, TagUncheckedCreateWithoutAccomplishmentsInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutAccomplishmentsInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutAccomplishmentsInput, TagUncheckedUpdateWithoutAccomplishmentsInput>
  }

  export type TagUpdateWithoutAccomplishmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateWithoutAccomplishmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentCreateManyCategoryInput = {
    id?: string
    title: string
    description?: string | null
    date: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccomplishmentUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: AccomplishmentTagUpdateManyWithoutAccomplishmentNestedInput
  }

  export type AccomplishmentUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: AccomplishmentTagUncheckedUpdateManyWithoutAccomplishmentNestedInput
  }

  export type AccomplishmentUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccomplishmentTagCreateManyTagInput = {
    id?: string
    accomplishmentId: string
  }

  export type AccomplishmentTagUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishment?: AccomplishmentUpdateOneRequiredWithoutTagsNestedInput
  }

  export type AccomplishmentTagUncheckedUpdateWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishmentId?: StringFieldUpdateOperationsInput | string
  }

  export type AccomplishmentTagUncheckedUpdateManyWithoutTagInput = {
    id?: StringFieldUpdateOperationsInput | string
    accomplishmentId?: StringFieldUpdateOperationsInput | string
  }

  export type AccomplishmentTagCreateManyAccomplishmentInput = {
    id?: string
    tagId: string
  }

  export type AccomplishmentTagUpdateWithoutAccomplishmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: TagUpdateOneRequiredWithoutAccomplishmentsNestedInput
  }

  export type AccomplishmentTagUncheckedUpdateWithoutAccomplishmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type AccomplishmentTagUncheckedUpdateManyWithoutAccomplishmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tagId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}