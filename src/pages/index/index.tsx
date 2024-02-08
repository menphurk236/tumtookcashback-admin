import { Fragment, useState, useEffect } from "react";

import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";

import Container from "@/components/Container";
import { Input, Card, Button, SvgIcon } from "@/components/UI";
import { formatNumber } from "@/utils/format/number";
import { SearchService } from "@/services";

import background from "../../assets/backgroud-new.jpg";
import backgroundMobile from "../../assets/bg-mobile-new.jpg";
import backgroundInner from "../../assets/backgroud-inner.jpg";

import { useBackofficeLayout, useDebounce } from "@/hooks";
import type { ITransaction } from "@/types/modules/transaction";

interface ISelectData {
  data?: {
    balance: number;
    company: string;
    name: string;
    tel: string;
    transactions: Pick<ITransaction, "remark">[];
  };
  label: string;
  value: string;
}

export const HomePage = () => {
  const { scrollToTop } = useBackofficeLayout();
  const [selectData, setSelectData] = useState<ISelectData>(null);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 200);
  const [width, setWindowWidth] = useState(0);
  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };

  const responsive = width > 1023;

  const handleSelect = (val) => {
    setSelectData((state) => ({ ...state, ...val }));
    if (val) {
      setSearch(val.label);
    }
  };

  // _Query
  const { data } = useQuery(
    ["search-customer", debouncedSearch],
    ({ signal }) =>
      SearchService.search({ search: debouncedSearch }, { signal }),
    {
      onSuccess: scrollToTop,
    }
  );

  return (
    <Fragment>
      <section
        // className={clsx(`bg-red-800 pt-32 min-h-screen`)}
        className={clsx(`pt-28 min-h-screen`)}
        style={{
          backgroundImage: responsive
            ? `url(${background})`
            : `url(${backgroundMobile})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundBlendMode: "multiply",
          height: "10px",
        }}
      >
        <Container>
          {/*<div className={clsx(`flex justify-center`)}>*/}
          {/*  <Logo className={clsx(`mb-8`)} type="white" />*/}
          {/*</div>*/}
          <div
            className={clsx(
              `mt-2 grid h-full grid-cols-1 content-center gap-12`,
              `sm:grid-cols-1`
            )}
          >
            <div className={clsx(`flex flex-col items-center justify-center`)}>
              <span className={clsx(`text-5xl`)}>CASHBACK</span>
              <div className={clsx(`mt-3 flex items-center space-x-2`)}>
                <Input.AutoComplete
                  suffix={
                    <SvgIcon name="search" className={clsx(`square-6`)} />
                  }
                  className={clsx(`w-[300px]`, `sm:w-auto`)}
                  id="search"
                  name="search"
                  placeholder="ค้นหารายชื่อ"
                  emptyMsg="ไม่พบข้อมูลการค้นหา"
                  value={search}
                  items={
                    data
                      ? data?.item.map((e) => ({
                          label: e.company === "-" ? e.name : e.company,
                          value: e.name,
                          data: e,
                        }))
                      : []
                  }
                  onSelected={(val) => handleSelect(val)}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Button
                  variant="primary-solid"
                  type="submit"
                  className={clsx(`min-h-[40px] !px-4`)}
                >
                  ค้นหา
                </Button>
              </div>
              <label>กรอกเบอร์โทรหรือเลขที่ใบเสนอราคาเพื่อเช็ค Cashback</label>
            </div>
            {selectData && (
              <>
                <div className="grid grid-cols-2 justify-center gap-1">
                  <div className="w-26 h-12">
                    <Card className={clsx(`h-fit bg-opacity-80 p-0`)}>
                      <div
                        className={clsx(`rounded-t-lg p-4`)}
                        style={{
                          background: "#ed1f24",
                        }}
                      >
                        <span className={clsx(`text-header-4 text-white-900`)}>
                          ข้อมูลลูกค้า
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-6 py-4">
                        {/* <SvgIcon name="backoffice-user-square" className={clsx(`text-primary-500/70 square-20`)} /> */}
                        <div className={clsx(`mt-2`)}>
                          <div className={clsx(`text-body-20`)}>
                            เบอร์ติดต่อ: {selectData.data.tel}
                          </div>
                          <div className={clsx(`text-body-20`)}>
                            Cashback คงเหลือปัจจุบัน:{" "}
                            <span className={clsx(`text-header-3`)}>
                              {formatNumber({
                                number: selectData?.data.balance,
                                decimals: 2,
                              })}
                              ฿
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-26 h-12">
                    <Card className={clsx(`mb-20 h-fit bg-opacity-80 p-0`)}>
                      <div
                        className={clsx(`rounded-t-lg p-4`)}
                        style={{
                          background: "#ed1f24",
                        }}
                      >
                        <span className={clsx(`text-header-4 text-white-900`)}>
                          อ้างอิงธุรกรรม
                        </span>
                      </div>

                      <div className={clsx(`my-2`)}>
                        {selectData?.data.transactions.map((item, idx) => {
                          return (
                            <div
                              className="flex items-center px-6 py-2"
                              key={idx}
                            >
                              <div>{`${idx + 1}. ${item.remark}`}</div>
                            </div>
                          );
                        })}
                        {selectData?.data.transactions.length === 0 && (
                          <div className="flex items-center justify-center">
                            <div
                              className={clsx(
                                "text-secondary py-6 text-center text-body-14"
                              )}
                            >
                              👻 No data.
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
          {selectData === null ? (
            <div className="justify-center sm:px-12 sm:p-6 xl:p-8">
              <img
                className="m-auto max-h-full object-scale-down"
                src={backgroundInner}
                width={700}
                alt=""
              />
            </div>
          ) : (
            ""
          )}
        </Container>
      </section>
    </Fragment>
  );
};
