import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Stack,
} from "@mui/material";

import NotFound from "src/components/illustrations/noDataFound/noDataFound";
import Pagination from "src/components/pagination";
import TableHead from "./tableHead";
// ----------------------------------------------------------------------

export default function CustomTable({ ...props }) {
  const { type, headData, data, isLoading, mobileRow, row, ...rest } = props;

  const Component = row;
  const CardComponent = mobileRow;
  return (
    <>
      {!isLoading && data?.data.length === 0 ? (
        <Card>
          <NotFound title="No Order Found" />
        </Card>
      ) : (
        <>
          <Card sx={{ display: { md: "block", xs: "none" } }}>
            <TableContainer>
              <Table>
                <TableHead headData={headData} />
                <TableBody>
                  {(isLoading ? Array.from(new Array(6)) : data?.data).map(
                    (item: any) => {
                      return (
                        <Component
                          key={Math.random()}
                          row={item}
                          isLoading={isLoading}
                          {...rest}
                        />
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          {mobileRow && (
            <Box sx={{ display: { md: "none", xs: "block" } }}>
              {(isLoading ? Array.from(new Array(6)) : data.data).map(
                (row: any) => (
                  <CardComponent
                    key={Math.random()}
                    item={row}
                    isLoading={isLoading}
                    {...rest}
                  />
                )
              )}
            </Box>
          )}

          {!isLoading && (
            <Stack alignItems="flex-end" mt={2} pr={2}>
              <Pagination data={data} />
            </Stack>
          )}
        </>
      )}
    </>
  );
}
