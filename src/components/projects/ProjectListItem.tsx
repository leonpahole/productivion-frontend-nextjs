import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { GraphqlProject } from "../../pages/my-projects";
import { formatTimestamp } from "../../utils/dateFormat";
import { pluralize } from "../../utils/pluralize";
import { ButtonLink } from "../ButtonLink";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  },
  rightDate: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  bottomDate: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "initial",
    },
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  cardHeader: {
    cursor: "pointer",
  },
}));

interface ProjectListItemProps {
  project: GraphqlProject;
  onDelete(): void;
  onUpdate(): void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onDelete,
  onUpdate,
}) => {
  const styles = useStyles();
  const router = useRouter();

  return (
    <Card className={styles.card} key={project.id} variant="outlined">
      <CardHeader
        className={styles.cardHeader}
        onClick={() => {
          router.push(`/project/${project.id}`);
        }}
        action={
          <Typography
            className={styles.rightDate}
            variant="subtitle1"
            color="textSecondary"
          >
            {formatTimestamp(project.createdAt)}
          </Typography>
        }
        title={project.title}
        subheader={project.description}
      />
      <CardContent className={styles.cardContent}>
        <Box mb={1} className={styles.bottomDate}>
          <Typography variant="body2" color="textSecondary" component="p">
            12. 9. 2020
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" component="p">
          {project.taskCount > 0
            ? `${project.taskCount} ${pluralize(project.taskCount, "task")}`
            : "No tasks so far"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {project.userCount > 0
            ? `${project.userCount} ${pluralize(
                project.userCount,
                "collaborator"
              )}`
            : "No collaborators"}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={() => router.push(`/project/${project.id}`)}
          color="inherit"
        >
          <VisibilityIcon />
        </IconButton>

        {project.capabilities.canUpdateProject && (
          <IconButton onClick={onUpdate} color="inherit">
            <EditIcon />
          </IconButton>
        )}

        {project.capabilities.canDeleteProject && (
          <IconButton onClick={onDelete} color="secondary">
            <DeleteIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};
