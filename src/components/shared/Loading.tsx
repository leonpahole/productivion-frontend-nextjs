import { Box, CircularProgress } from "@material-ui/core";

export const Loading: React.FC<{}> = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Box>
  );
};
