"use client";

import React, { useEffect, useRef, useState } from "react";
import FormButtons from "../UI/FormButtons";
import * as yup from "yup";
import MultiTagInput from "../UI/MultiTagInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import BranchSelectWrapper from "../wrapper/BranchSelectWrapper";
import { DepartmentFormValues } from "@/types/department.types";
import Input from "../UI/Input";

const schema = yup.object({
  branchIds: yup
    .array()
    .of(yup.number())
    .required().default([]),

  departments: yup
    .array()
    .of(yup.string().trim().required())
    .min(1, "Add at least one department")
    .required(),
});

type Props = {
  onSubmit: (data: DepartmentFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  isOpen?: boolean;
  initialData?: Partial<DepartmentFormValues>;
};

const DepartmentForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  isOpen,
  isEdit,
  isSubmitting = false,
  initialData = {},
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<DepartmentFormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      branchIds: [],
      departments: [],
    },
  });

useEffect(() => {
  if (!isOpen) return;

  reset({
    branchIds: initialData?.branchIds ?? [],
    departments: initialData?.departments ?? [],
  });
}, [isOpen]);


  

  const submit: SubmitHandler<DepartmentFormValues> = (data) => {
    onSubmit(data);

  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Branch Information */}

        {/* Branch dropdown */}
        <Controller
          name="branchIds"
          control={control}
          render={({ field }) => (
            <BranchSelectWrapper
              value={field.value || []}
              onChange={field.onChange}
              error={errors.branchIds?.message}
              multiple = {true}
            />
          )}
        />

        {isEdit ? (
          <Controller
            name="departments"
            control={control}
            render={({ field }) => (
              <Input
                label="Department"
                type="text"
                placeholder="Enter department name"
                value={field.value?.[0] || ""}
                onChange={(e) => field.onChange([e.target.value])}
                error={errors.departments?.message}
                required
              />
            )}
          />
        ) : (
          <Controller
            name="departments"
            control={control}
            render={({ field }) => (
              <MultiTagInput
                label="Department"
                values={field.value}
                onChange={field.onChange}
                placeholder="Enter department names..."
                error={errors.departments?.message}
              />
            )}
          />
        )}
      </div>

      <FormButtons
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        submitText="Save"
        submitDisabled={!isValid}
      />
    </form>
  );
};

export default DepartmentForm;
