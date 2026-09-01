type FormMessageProps = {
  message: string;
  isError?: boolean;
};

export default function FormMessage({ message, isError = false }: FormMessageProps) {
  if (!message) return null;

  return <p className={isError ? "text-red-600 mt-3" : "text-green-600 mt-3"}>{message}</p>;
}
