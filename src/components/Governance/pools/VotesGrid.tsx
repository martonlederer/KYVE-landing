import { Grid } from "@geist-ui/react";

const VotesGrid = (props) => {
  return (
    <>
      <Grid.Container>
        {props.votes.map((vote) => {
          return (
            <Grid>
              <div>Vote</div>
            </Grid>
          );
        })}
      </Grid.Container>
    </>
  );
};

export default VotesGrid;
