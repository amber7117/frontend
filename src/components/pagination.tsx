import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";

export default function PaginationRounded({ ...props }) {
  const { data } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = React.useState(1);
  
  const handleChange = (event: any, value: any) => {
    setPage(value);
    
    // 创建新的URLSearchParams对象
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    
    // 构建新的URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };
  
  React.useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      setPage(Number(pageParam));
    }
  }, [searchParams]);
  
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
