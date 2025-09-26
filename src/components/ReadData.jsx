import { useState, useEffect } from 'react';
import { Typography,Grid,IconButton, Stack, Card, Skeleton } from "@mui/material";
import Box from '@mui/material/Box';
import RootStyled from "src/components/_main/home/featured/styled";

import Image from 'next/image';

function ReadData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your Firebase Cloud Function API
    fetch('https://us-central1-gogogm-f56b0.cloudfunctions.net/api/readData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add any request body data if needed
      // body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <RootStyled>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        className="stack">
        <Typography variant="h2" color="text.primary" className="heading">
          Categories
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        className="description">
        Lorem ipsum
      </Typography>
      <div className="image-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} >
              {data.map((item) => (
                <Grid item lg={2} md={2} sm={4} xs={4} key={item.docId}>
                  <Box mx={3}>
                    <Card className="slider-main">
                      <a
                        href="/free-fire-diamonds-pin-garena?ps=Home-Popular-Game-Card"
                        title="Free Fire Diamonds Pins (Garena)"
                      >
                        <ul>
                          <li>
                            <div className="image-and-title">
                              <div className="img" >
                                <Image width={60} height={60} src={item.imageUrl} alt={item.title} loading="lazy" />
                              </div>
                              <div className="name">{item.title}</div>
                            </div>
                          </li>
                        </ul>
                      </a>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <style jsx>{`
          .image-and-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .img {
            flex: 1;
            max-width: 100%;
            max-height: 100%;
          }
          .name {
            flex: 2;
            font-weight: bold;
          }
        `}</style>
      </div>
    </RootStyled>
  );
}



export default ReadData;
