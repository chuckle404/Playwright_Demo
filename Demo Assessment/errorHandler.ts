export class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  }
  
  export const handleError = (error: unknown): void => {
    console.error(`Custom Error: ${error instanceof Error ? error.message : error}`);
    throw new CustomError('A test failed due to an unexpected error');
  };
  