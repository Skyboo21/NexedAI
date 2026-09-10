declare module "zod" {
  export class z {
    static string: any;
    static object: any;
    static literal: any;
    static number: any;
    static boolean: any;
    static enum: any;
  }
  export namespace z {
    export type infer<T> = any;
  }
}

declare module "class-variance-authority" {
  export const cva: any;
  export type VariantProps<T> = any;
}
