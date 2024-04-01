import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "./ui/use-toast";
import { Payment } from "@/lib/definitions";
import { addUserAsync } from "@/store/usersSlice";
import { useAppDispatch } from "@/hooks/typeshook";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  name: z.string().refine(
    (value) => {
      const words = value.trim().split(" ");
      return words.length >= 2;
    },
    {
      message: "Full name must contain at least two words.",
    }
  ),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  amount: z
    .string()
    .transform((value) => {
      const parsedValue = Number(value.replace(",", "."));
      return isNaN(parsedValue) ? null : parsedValue;
    })
    .refine((value) => value !== null, {
      message: "Amount must be a valid number.",
    })
    .refine((value) => value !== null && value >= 0, {
      message: "Amount must be greater than or equal to 0.",
    })
    .refine((value) => value !== null && value <= 2147483647, {
      message: "Amount must be less than or equal to 2,147,483,647.",
    }),
});

export function ProfileForm() {
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      // @ts-expect-error: temporary solution for artificially created amount field
      amount: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, name, email, amount } = values;
    const amountValue = amount !== null ? Number(amount) : undefined;
    const users: Payment = {
      username,
      name,
      email,
      amount: amountValue,
    };
    dispatch(addUserAsync(users));

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-700 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-8 px-3"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <div className="flex items-center">
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <div className="flex items-center">
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter amount"
                  {...field}
                  value={field.value?.toString()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
