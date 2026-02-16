"use client";

import React, { useEffect, useRef, useState } from "react";
import FormButtons from "../UI/FormButtons";
import * as yup from "yup";
import MultiTagInput from "../UI/MultiTagInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import BranchSelectWrapper from "../wrapper/BranchSelectWrapper";
import Input from "../UI/Input";
import { PositionFormValues } from "@/types/position.types";
import DepartmentSelectWrapper from "../wrapper/DepartmentSelectWrapper";

const schema = yup.object({
  branchId: yup.number().nullable(),
  departmentId: yup.number().required('Department is required'),
  positions: yup
    .array()
    .of(yup.string().trim().required())
    .min(1, "Add at least one position")
    .required(),
});

type Props = {
  onSubmit: (data: PositionFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
  isOpen?: boolean;
  initialData?: Partial<PositionFormValues>;
};

const PositionForm: React.FC<Props> = ({
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
    watch,
    formState: { errors, isValid },
  } = useForm<PositionFormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: {
      branchId: initialData?.branchId ?? undefined,
      departmentId: initialData?.departmentId ?? undefined,
      positions: initialData?.positions ?? [],
    },
  });

  const selectedBranch = watch('branchId');

useEffect(() => {
  if (!isOpen) return;

  reset({
      branchId: initialData?.branchId ?? undefined,
      departmentId: initialData?.departmentId ?? undefined,
      positions: initialData?.positions ?? [],
  });
}, [isOpen]);


  const submit: SubmitHandler<PositionFormValues> = (data) => {
    console.log(data,'data coming')
    onSubmit(data);

  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Branch Information */}

        {/* Branch dropdown */}
        <Controller
          name="branchId"
          control={control}
          render={({ field }) => (
            <BranchSelectWrapper
              value={field.value ?? null}
              onChange={field.onChange}
              error={errors.branchId?.message}
              multiple = {false}
            />
          )}
        />


      <Controller
        name="departmentId"
        control={control}
        render={({ field }) => (
          <DepartmentSelectWrapper
            branchId={selectedBranch}
            value={field.value}
            onChange={field.onChange}
            error={errors.departmentId?.message}
          />
        )}
      />

    

        {isEdit ? (
          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <Input
                label="Position"
                type="text"
                placeholder="Enter position name"
                value={field.value?.[0] || ""}
                onChange={(e) => field.onChange([e.target.value])}
                error={errors.positions?.message}
                required
              />
            )}
          />
        ) : (
          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <MultiTagInput
                label="Position"
                values={field.value}
                onChange={field.onChange}
                placeholder="Enter position names..."
                error={errors.positions?.message}
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

export default PositionForm;
