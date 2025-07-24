export class BaseResponseBuilder<T = any> {
  private response: Record<string, any> = {};

  public withData(data: T): this {
    this.response.data = data;
    return this;
  }

  public withMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  public withSuccess(success: boolean): this {
    this.response.success = success;
    return this;
  }

  public withMeta(meta: Record<string, any>): this {
    this.response.meta = meta;
    return this;
  }

  public build(): Record<string, any> {
    return this.response;
  }
} 