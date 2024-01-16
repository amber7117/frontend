import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import _ from "lodash";

export default function PaginationRounded({ ...props }) {
  const { data } = props;
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const handleChange = (event: any, value: any) => {
    setPage(value);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: `${value}`,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  React.useEffect(() => {
    if (_.has(router.query, "page")) {
      setPage(Number(router.query.page));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Stack spacing={2}>
      <Pagination
        count={data?.count}
        page={page}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        sx={{ mx: "auto", mb: 3 }}
      />
    </Stack>
  );
}
