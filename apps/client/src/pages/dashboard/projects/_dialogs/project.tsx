import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { CaretDown, Flask, MagicWand, Plus } from "@phosphor-icons/react";
import { createProjectSchema, ProjectDto } from "@apitool/dto";
import { idSchema } from "@apitool/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
} from "@apitool/ui";
import { cn, generateRandomName, kebabCase } from "@apitool/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateProject, useDeleteProject, useUpdateProject } from "@/client/services/project";
import { useDialog } from "@/client/stores/dialog";

const formSchema = createProjectSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const ProjectDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ProjectDto>("project");

  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";
  const isDuplicate = mode === "duplicate";

  const { createProject, loading: createLoading } = useCreateProject();
  const { updateProject, loading: updateLoading } = useUpdateProject();
  const { deleteProject, loading: deleteLoading } = useDeleteProject();

  const loading = createLoading || updateLoading || deleteLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", slug: "", isPublic: true, isMaintenanceOn: true },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  useEffect(() => {
    const slug = kebabCase(form.watch("name"));
    form.setValue("slug", slug);
  }, [form.watch("name")]);

  const onSubmit = async (values: FormValues) => {
    if (isCreate) {
      await createProject({
        slug: values.slug,
        name: values.name,
        isPublic: values.isPublic,
        isMaintenanceOn: values.isMaintenanceOn
      });
    }

    if (isUpdate) {
      if (!payload.item?.id) return;

      await updateProject({
        ...payload.item,
        name: values.name,
        slug: values.slug || '',
      });
    }

    if (isDuplicate) {
      if (!payload.item?.id) return;
    }

    if (isDelete) {
      if (!payload.item?.id) return;

      await deleteProject({ id: payload.item?.id });
    }

    close();
  };

  const onReset = () => {
    if (isCreate) form.reset({ name: "", slug: "", isPublic: true, isMaintenanceOn: true });
    if (isUpdate)
      form.reset({ id: payload.item?.id, name: payload.item?.name, slug: payload.item?.slug });
    if (isDuplicate)
      form.reset({ name: `${payload.item?.name} (Copy)`, slug: `${payload.item?.slug}-copy` });
    if (isDelete)
      form.reset({ id: payload.item?.id, name: payload.item?.name, slug: payload.item?.slug });
  };

  const onGenerateRandomName = () => {
    const name = generateRandomName();
    form.setValue("name", name);
    form.setValue("slug", kebabCase(name));
  };

  const onCreateSample = async () => {
    const randomName = generateRandomName();
    const { name, slug } = form.getValues();
    close();
  };

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent>
          <Form {...form}>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>{t`Are you sure you want to delete your project?`}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t`This action cannot be undone. This will permanently delete your project and cannot be recovered.`}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
                <AlertDialogAction variant="error" onClick={form.handleSubmit(onSubmit)}>
                  {t`Delete`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>
                    {isCreate && t`Create a new project`}
                    {isUpdate && t`Update an existing project`}
                    {isDuplicate && t`Duplicate an existing project`}
                  </h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isCreate && t`Start building your project by giving it a name.`}
                {isUpdate && t`Changed your mind about the name? Give it a new one.`}
                {isDuplicate && t`Give your old project a new name.`}
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Title`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />

                      {(isCreate || isDuplicate) && (
                        <Tooltip content={t`Generate a random title for your project`}>
                          <Button
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={onGenerateRandomName}
                          >
                            <MagicWand />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t`Tip: You can name the project referring to the position you are applying for.`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Slug`}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isPublic"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`isPublic`}</FormLabel>
                  <FormControl>
                    <Checkbox
                      className="ml-2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isMaintenanceOn"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t`isMaintenanceOn`}</FormLabel>
                    <FormControl>
                      <Checkbox
                        className="ml-2"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <DialogFooter>
              <div className="flex items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {isCreate && t`Create`}
                  {isUpdate && t`Save Changes`}
                  {isDuplicate && t`Duplicate`}
                </Button>

                {isCreate && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="icon" className="rounded-l-none border-l">
                        <CaretDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="center">
                      <DropdownMenuItem onClick={onCreateSample}>
                        <Flask className="mr-2" />
                        {t`Create Sample Project`}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
