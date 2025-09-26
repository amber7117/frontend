// react
import React, { useState, useEffect } from "react";
import Image from 'next/image';
// material
import { Typography,Button, Container, Card, CardContent, Box, Grid, Stack } from "@mui/material";
// next
import { useRouter } from "next/router";
import BlurImage from "./blurImage";


function ReadData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState(12); // Number of initially visible images
  const router = useRouter();

  useEffect(() => {
    // Fetch data from your Firebase Cloud Function API
    fetch('https://us-central1-gogogm-f56b0.cloudfunctions.net/api/readData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

  const loadMoreImages = () => {
    setVisibleImages(visibleImages + 12); // Increase the number of visible images
  };

  return (

      


          
  <Grid container spacing={2}>
     <Grid item md={8} xs={12}>
      <Card sx={{ textAlign: "center", p: 4 }}>
        <Box position="relative" sx={{ width: 300, height: 200, mx: "auto" }}>
                <BlurImage
                  src="/images/commercehope-client-app.png"
                  alt="banner-2"
                  layout="fill"
                  objectFit="contain"
                  placeholder="blur"
                  blurDataURL="/images/nextstore-client-app.png"
                />
              </Box>
   
          <CardContent>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              className="stack"
            >
              <Typography variant="h2" color="text.primary" className="heading">
                {/* Your heading content */}
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              className="description"
            >
              {/* Your description content */}
            </Typography>
            <Box>
              <Grid container spacing={2} justifyContent="center">
                {data.slice(0, visibleImages).map((item) => (
                  <Grid item lg={2} md={3} sm={4} xs={4} key={item.docId}>
                    <div className="image-and-title item">
                     <a
                      href="/free-fire-diamonds-pin-garena?ps=Home-Popular-Game-Card"
                      title="Free Fire Diamonds Pins (Garena)"
                    >
                      <div className="img">
                        <Image
                          width={60}
                          height={60}
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="name">{item.title}</div>
                      </a>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {visibleImages < data.length && (
              <Button
                variant="contained"
                color="primary"
                onClick={loadMoreImages}
                fullWidth
              >
                View More
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
   </Grid> 

  );
}

export default ReadData;
