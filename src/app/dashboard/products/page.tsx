"use client";
import React from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProduct,
  deleteProduct,
  getProducts,
} from "@/actions/products.action";
import { Product, Category, Order } from "@/lib/schemas/db";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/actions/categories.action";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn, FormatCFA } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  description: z.string().optional(),
  price: z.number().min(1, "Le prix doit être supérieur à 1"),
  quantity: z.number().min(1, "La quantité doit être supérieure à 1"),
  categoryId: z.string().min(1, "La catégorie est obligatoire"),
});

const Page = () => {
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getProducts(),
    placeholderData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
    placeholderData: [],
    initialData: [],
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: z.infer<typeof formSchema>) =>
      await addProduct(product),
    onSuccess: () => {
      toast.success("Le produit a bien été créé");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => await deleteProduct(productId),
    onSuccess: () => {
      toast.success("Le produit a bien été supprimé");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la suppression");
    },
  });

  const TABLE_COLUMNS = [
    {
      title: "Nom",
      row: (product: Product) => (
        <TableCell className="font-medium">{product.name}</TableCell>
      ),
    },
    {
      title: "Description",
      row: (product: Product) => (
        <TableCell className={"truncate text-ellipsis w-[350px]"}>
          {product.description}
        </TableCell>
      ),
      style: {
        width: "350px",
      },
    },
    {
      title: "Catégorie",
      row: (product: Product & Record<"category", Category>) => (
        <TableCell>{product.category.name}</TableCell>
      ),
    },
    {
      title: "P.U",
      row: (product: Product) => (
        <TableCell className="text-right">{FormatCFA(product.price)}</TableCell>
      ),
      style: {
        align: "right",
      },
    },
    {
      title: "Quantité en stock",
      row: (product: Product) => (
        <TableCell className="text-right">{product.quantityInStock}</TableCell>
      ),
      style: {
        align: "right",
      },
    },
    {
      title: "Ventes",
      row: (product: Product & Record<"orders", Order[]>) => (
        <TableCell className="text-right">{product.orders.length}</TableCell>
      ),
      style: {
        align: "right",
      },
    },
    {
      title: "Ajouté le",
      row: (product: Product) => (
        <TableCell>
          {format(
            new Date(product.createdAt).toLocaleDateString(),
            "dd LLL y",
            {
              locale: fr,
            },
          )}
        </TableCell>
      ),
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "-",
      price: 1,
      quantity: 1,
      categoryId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProductMutation.mutate(values);
  }

  return (
    <div className={"flex flex-col gap-12 px-20"}>
      <Header
        title={"Produits"}
        actions={[
          <Credenza key={"new_product"}>
            <CredenzaTrigger asChild>
              <Button className={"text-xs font-medium gap-1"}>
                <span className={"text-xl"}>+</span>
                <span>Nouveau produit</span>
              </Button>
            </CredenzaTrigger>
            <CredenzaContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <CredenzaHeader>
                    <CredenzaTitle>Nouveau produit</CredenzaTitle>
                    <CredenzaDescription>
                      Créez un nouveau produit
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody className={"space-y-6"}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Saisissez le nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Saisissez la description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              min={1}
                              onChange={(e) => {
                                form.setValue("price", Number(e.target.value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité en stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              min={1}
                              onChange={(e) => {
                                form.setValue(
                                  "quantity",
                                  Number(e.target.value),
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value
                                      ? categories.find(
                                          (category) =>
                                            category.id === field.value,
                                        )?.name
                                      : "Selectionner une catégorie"}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Cherchez une catégorie..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucune catégorie trouvée.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {categories.map((category) => (
                                        <CommandItem
                                          value={category.id}
                                          key={category.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "categoryId",
                                              category.id,
                                            );
                                          }}
                                        >
                                          {category.name}
                                          <CheckIcon
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              category.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CredenzaBody>
                  <CredenzaFooter>
                    <Button
                      disabled={createProductMutation.isPending}
                      className={"gap-2"}
                      type={"submit"}
                    >
                      Confirmer{" "}
                      {createProductMutation.isPending && (
                        <Loader2 size={16} className={"animate-spin"} />
                      )}
                    </Button>
                    <CredenzaClose asChild>
                      <Button
                        variant={"destructive"}
                        disabled={createProductMutation.isPending}
                      >
                        Annuler
                      </Button>
                    </CredenzaClose>
                  </CredenzaFooter>
                </form>
              </Form>
            </CredenzaContent>
          </Credenza>,
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((column, index) => (
              <TableHead
                key={index}
                style={{
                  width: column.style?.width ?? "auto",
                  textAlign: (column.style?.align ?? "left") as
                    | "left"
                    | "right"
                    | "center",
                }}
              >
                {column.title}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id} className={"cursor-pointer"}>
              {TABLE_COLUMNS.map((column, index) => (
                <React.Fragment key={index}>
                  {column.row(product)}
                </React.Fragment>
              ))}
              <TableCell className="flex justify-end items-center gap-2">
                <Credenza>
                  <CredenzaTrigger asChild>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      disabled={
                        deleteProductMutation.isPending ||
                        product.orders.length > 0
                      }
                    >
                      <Trash2 size={18} />
                    </Button>
                  </CredenzaTrigger>
                  <CredenzaContent>
                    <CredenzaHeader>
                      <CredenzaTitle>Supprimer</CredenzaTitle>
                      <CredenzaDescription>
                        Confirmation de la suppression de cet élément
                      </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                      <span>
                        Êtes-vous sûr de vouloir supprimer cet élément ?
                      </span>
                    </CredenzaBody>
                    <CredenzaFooter>
                      <Button
                        disabled={deleteProductMutation.isPending}
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        className={"gap-2"}
                      >
                        Confirmer{" "}
                        {deleteProductMutation.isPending && (
                          <Loader2 size={16} className={"animate-spin"} />
                        )}
                      </Button>
                      <CredenzaClose asChild>
                        <Button
                          variant={"destructive"}
                          disabled={deleteProductMutation.isPending}
                        >
                          Annuler
                        </Button>
                      </CredenzaClose>
                    </CredenzaFooter>
                  </CredenzaContent>
                </Credenza>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
