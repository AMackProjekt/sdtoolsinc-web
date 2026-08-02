// Minimal Convex data-model types for builds where generated schema output is absent.
// Replace this shim by running `npx convex codegen` when the Convex schema is restored.

export type Id<TableName extends string> = string & {
  readonly __tableName?: TableName;
};

export type Doc<TableName extends string> = {
  _id: Id<TableName>;
  _creationTime: number;
  [field: string]: any;
};
