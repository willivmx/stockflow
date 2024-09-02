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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  getCategories,
} from "@/actions/categories.action";
import { Category, Product } from "@/lib/schemas/db";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().optional(),
});

const Page = () => {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await getCategories(),
    placeholderData: [],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (category: z.infer<typeof formSchema>) =>
      await addCategory(category),
    onSuccess: () => {
      toast.success("L'élément a bien été créé");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => await deleteCategory(categoryId),
    onSuccess: () => {
      toast.success("L'élément a bien été supprimé");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la suppression");
    },
  });

  const TABLE_COLUMNS = [
    {
      title: "Titre",
      row: (category: Category) => (
        <TableCell className="font-medium">{category.name}</TableCell>
      ),
    },
    {
      title: "Description",
      row: (category: Category) => (
        <TableCell className={"truncate text-ellipsis w-[350px]"}>
          {category.description}
        </TableCell>
      ),
      style: {
        width: "350px",
      },
    },
    {
      title: "Ajoutée le",
      row: (category: Category) => (
        <TableCell>
          {format(
            new Date(category.createdAt).toLocaleDateString(),
            "dd LLL y",
            {
              locale: fr,
            },
          )}
        </TableCell>
      ),
    },
    {
      title: "Modifiée le",
      row: (category: Category) => (
        <TableCell>
          {format(
            new Date(category.updatedAt).toLocaleDateString(),
            "dd LLL y",
            {
              locale: fr,
            },
          )}
        </TableCell>
      ),
    },
    {
      title: "Produits",
      row: (category: Category & Record<"products", Product[]>) => (
        <TableCell className={"text-right"}>
          {category.products.length}
        </TableCell>
      ),
      style: {
        align: "right",
      },
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "-",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCategoryMutation.mutate(values);
  }

  return (
    <div className={"flex flex-col gap-12"}>
      <Header
        title={"Catégories"}
        actions={[
          <Credenza key={"new_category"}>
            <CredenzaTrigger asChild>
              <Button className={"text-xs font-medium gap-1"}>
                <span className={"text-xl"}>+</span>
                <span>Nouvelle catégorie</span>
              </Button>
            </CredenzaTrigger>
            <CredenzaContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <CredenzaHeader>
                    <CredenzaTitle>Nouvelle catégorie</CredenzaTitle>
                    <CredenzaDescription>
                      Créez une nouvelle catégorie
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody className={"space-y-6"}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Saisissez le titre"
                              {...field}
                            />
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
                  </CredenzaBody>
                  <CredenzaFooter>
                    <Button
                      disabled={createCategoryMutation.isPending}
                      className={"gap-2"}
                      type={"submit"}
                    >
                      Confirmer{" "}
                      {createCategoryMutation.isPending && (
                        <Loader2 size={16} className={"animate-spin"} />
                      )}
                    </Button>
                    <CredenzaClose asChild>
                      <Button
                        variant={"destructive"}
                        disabled={createCategoryMutation.isPending}
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
          {categories?.map((category) => (
            <TableRow key={category.id} className={"cursor-pointer"}>
              {TABLE_COLUMNS.map((column, index) => (
                <React.Fragment key={index}>
                  {column.row(category)}
                </React.Fragment>
              ))}
              <TableCell className="flex justify-end items-center gap-2">
                <Credenza>
                  <CredenzaTrigger asChild>
                    <Button variant={"destructive"} size={"icon"}>
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
                        disabled={deleteCategoryMutation.isPending}
                        onClick={() =>
                          deleteCategoryMutation.mutate(category.id)
                        }
                        className={"gap-2"}
                      >
                        Confirmer{" "}
                        {deleteCategoryMutation.isPending && (
                          <Loader2 size={16} className={"animate-spin"} />
                        )}
                      </Button>
                      <CredenzaClose asChild>
                        <Button
                          variant={"destructive"}
                          disabled={deleteCategoryMutation.isPending}
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
