import { Fragment } from "react";

import clsx from "clsx";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button, Card, Input } from "@/components/UI";
import { getErrorWithTouched } from "@/utils/form";
import { CustomerService } from "@/services";
import { handleAxiosErrorMsg } from "@/libs/axios";
import SimplePageLoader from "@/components/UI/PageLoader/SimplePageLoader";

import type { ICustomer } from "@/types/modules/customer";

interface IFormValues {
  name: string;
  company: string | null;
  tel: string;
  tax: string;
}

const phoneRegExp = /^[0-9]*$/;

const validationSchema = yup.object().shape({
  // name: yup.string().required(`กรุณากรอกชื่อ`),
  // company: yup.string().required(`กรุณากรอกชื่อบริษัท`),
  tel: yup
    .string()
    .matches(phoneRegExp, "กรอกเป็นตัวเลขเท่านั้น โดยไม่มี -")
    .required(`กรุณากรอกเบอร์โทร`),
  // tax: yup.string().required(`กรุณากรอกหมายเลขผู้เสียภาษี`),
});

export const CustomerEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialValues: IFormValues = {
    name: null,
    company: null,
    tel: null,
    tax: null,
  };

  // _Form
  const formik = useFormik<IFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  //_ Query
  const { isLoading: isLoadingData } = useQuery(
    ["get-customer-byId"],
    () => CustomerService.byId(id),
    {
      onSuccess: (res) => {
        Object.entries(res).forEach(([key, value]) => {
          formik.setFieldValue(key, value);
        });
      },
    }
  );

  // _Mutation
  const { mutate, isLoading } = useMutation(
    (payload: Pick<ICustomer, "name" | "company" | "tel" | "tax">) =>
      CustomerService.update(id, payload),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err);
        toast.error(msg);
      },
      onSuccess: () => {
        navigate("/backoffice/customer");
      },
    }
  );

  if (isLoadingData) return <SimplePageLoader />;

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>แก้ไขข้อมูลลูกค้า</h3>
      <Card className={clsx(`mt-4`)}>
        <form onSubmit={formik.handleSubmit} className={clsx(`flex flex-col`)}>
          <div className={clsx(`mt-6`)}>
            <label htmlFor="name">ชื่อ</label>
            <Input
              id="name"
              name="name"
              className={clsx(`mt-2`)}
              placeholder="กรอกชื่อ"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={getErrorWithTouched(formik, "name")}
              disabled={isLoading}
            />
          </div>

          <div className={clsx(`mt-4`)}>
            <label htmlFor="company">ชื่อบริษัท</label>
            <Input
              id="company"
              name="company"
              className={clsx(`mt-2`)}
              placeholder="กรอกชื่อบริษัท"
              onChange={formik.handleChange}
              value={formik.values.company}
              error={getErrorWithTouched(formik, "company")}
              disabled={isLoading}
            />
          </div>

          <div className={clsx(`mt-4`)}>
            <label htmlFor="tel">เบอร์โทร</label>
            <Input
              id="tel"
              name="tel"
              className={clsx(`mt-2`)}
              placeholder="กรอกเบอร์โทร"
              onChange={formik.handleChange}
              value={formik.values.tel}
              error={getErrorWithTouched(formik, "tel")}
              disabled={isLoading}
            />
          </div>

          <div className={clsx(`mt-4`)}>
            <label htmlFor="tax">หมายเลขผู้เสียภาษี</label>
            <Input
              id="tax"
              name="tax"
              className={clsx(`mt-2`)}
              placeholder="กรอกหมายเลขผู้เสียภาษี"
              onChange={formik.handleChange}
              value={formik.values.tax}
              error={getErrorWithTouched(formik, "tax")}
              disabled={isLoading}
            />
          </div>

          <div className={clsx(`mt-6 flex items-center space-x-4`)}>
            <Link
              to="/backoffice/customer"
              className={clsx(`inline-block flex-1`)}
            >
              <Button
                variant="danger"
                className={clsx(`w-full`)}
                loading={isLoading}
              >
                <span className={clsx(`text-body-20`)}>ยกเลิก</span>
              </Button>
            </Link>
            <Button
              variant="success"
              className={clsx(`flex-1`)}
              type="submit"
              loading={isLoading}
            >
              <span className={clsx(`text-body-20`)}>บันทึก</span>
            </Button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};
