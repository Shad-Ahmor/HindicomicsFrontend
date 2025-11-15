import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Autocomplete
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FormatBold as FormatBoldIcon,
  SubdirectoryArrowLeft as SubdirectoryArrowLeftIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { encryptData, decryptData } from '../Security/cryptoUtils.js';  // Import the library functions



const shayariCategories = ["Love Shayari","Romantic Shayari","Ishq Shayari","Mohabbat Shayari","Pyar Shayari","Heart Touching Shayari","One Sided Love Shayari","Couple Shayari","Miss You Shayari","Proposal Shayari","Attachment Shayari","Commitment Shayari","Flirt Shayari","Crush Shayari","Affection Shayari","Sad Shayari","Dard Bhari Shayari","Bewafa Shayari","Judai Shayari","Tanhai Shayari","Broken Heart Shayari","Yaad Shayari","Regret Shayari","Aansu Shayari","Painful Shayari","Attitude Shayari","Royal Shayari","Killer Look Shayari","Boys Attitude Shayari","Girls Attitude Shayari","Status Shayari","Self Respect Shayari","Pride Shayari","Swag Shayari","Boss Shayari","Zindagi Shayari","Motivational Shayari","Inspirational Shayari","Life Reality Shayari","Positive Shayari","Struggle Shayari","Hard Work Shayari","Success Shayari","Hope Shayari","Faith Shayari","Soch Shayari","Darshanik Shayari","Reality Shayari","Karma Shayari","Wisdom Shayari","Truth Shayari","Experience Shayari","Deep Thought Shayari","Emotional Shayari","Khushi Shayari","Ehsaas Shayari","Dil Se Shayari","Moods Shayari","Tears Shayari","Smile Shayari","Mood Shayari","Good Morning Shayari","Good Night Shayari","Raat Shayari","Chand Shayari","Khwab Shayari","Subah Shayari","Evening Shayari","Sleep Shayari","Dosti Shayari","Friendship Shayari","Dost Ke Liye Shayari","Best Friend Shayari","Brother Shayari","Sister Shayari","Mother Shayari","Father Shayari","Parents Shayari","Family Shayari","Teacher Shayari","Relationship Shayari","Desh Bhakti Shayari","Army Shayari","Freedom Shayari","Republic Day Shayari","Independence Shayari","Social Shayari","Justice Shayari","Nature Shayari","Barsaat Shayari","Sawan Shayari","Hawa Shayari","Pahadon Shayari","Mountains Shayari","River Shayari","Sunset Shayari","Winter Shayari","Spring Shayari","Autumn Shayari","Funny Shayari","Mazahiya Shayari","Masti Shayari","Chutkule Wali Shayari","Comedy Shayari","Sarcasm Shayari","Nok Jhok Shayari","Birthday Shayari","Anniversary Shayari","Festival Shayari","Holi Shayari","Diwali Shayari","Eid Shayari","New Year Shayari","Valentine Shayari","Friendship Day Shayari","Mothers Day Shayari","Bhagwan Shayari","Allah Shayari","Sufi Shayari","Ram Shayari","Krishna Shayari","Shiv Shayari","Hanuman Shayari","Dua Shayari","Quran Shayari","Bible Shayari","Namaz Shayari","Bollywood Shayari","Filmy Dialogue Shayari","Hero Shayari","Heroine Shayari","Celebrity Shayari","Song Lines Shayari","Dialogues Shayari"];

const jokesCategories = ["Funny Jokes","Husband Wife Jokes","Santa Banta Jokes","Teacher Student Jokes","Pappu Jokes","Office Jokes","Doctor Patient Jokes","Desi Jokes","Indian Jokes","Political Jokes","Engineer Jokes","Programming Jokes","IT Jokes","Boss Employee Jokes","Friends Jokes","Marriage Jokes","Relationship Jokes","Girlfriend Boyfriend Jokes","School Jokes","College Jokes","Exam Jokes","Children Jokes","Kids Jokes","Animal Jokes","Police Jokes","Lawyer Jokes","Santa Jokes","Pappu Chutkule","One Liner Jokes","Adult Jokes (Clean)","Non-Veg Jokes (Mild)","Clean Jokes","Double Meaning Jokes","Festival Jokes","Holi Jokes","Diwali Jokes","Eid Jokes","Christmas Jokes","New Year Jokes","Teacher Jokes","Student Jokes","Hindi Jokes","English Jokes","Rajnikanth Jokes","Bollywood Jokes","Cricket Jokes","Sports Jokes","Corona Jokes","Whatsapp Jokes","Meme Jokes","Social Media Jokes","Smartphone Jokes","Technology Jokes","Modern Life Jokes","Father Son Jokes","Mother Jokes","Family Jokes","Couple Jokes","Dating Jokes","Girlfriend Jokes","Boyfriend Jokes","Funny Shayari Jokes","Sarcastic Jokes","Savage Jokes","Attitude Jokes","Insult Jokes","Comedy Jokes","Situational Jokes","Work From Home Jokes","Daily Life Jokes","Lazy People Jokes","Morning Jokes","Night Jokes","Logic Jokes","Puzzles Jokes","Dark Humor Jokes (Soft)","Classic Jokes","Old School Jokes","Short Jokes","Long Jokes","Quotes Jokes","Emoji Jokes","Political Satire Jokes","Animal Funny Jokes","Travel Jokes","Teacher Kids Jokes","Marriage Humor","Love Jokes","Festival Humor","Desi Chutkule","Funny SMS","Funny Status","One Line Humor","Couple Comedy","Funny Quotes"];

const storyCategories = ["Moral Stories","Motivational Stories","Inspiration Stories","Love Stories","Romantic Stories","Sad Stories","Emotional Stories","Friendship Stories","Life Stories","Real Life Stories","Short Stories","Funny Stories","Horror Stories","Ghost Stories","Thriller Stories","Suspense Stories","Detective Stories","Adventure Stories","Fantasy Stories","Mythological Stories","Historical Stories","Folk Tales","Panchatantra Stories","Akbar Birbal Stories","Tenali Raman Stories","Grandmother Stories","Children Stories","Kids Moral Stories","Animal Stories","Jungle Stories","Fairy Tales","Princess Stories","King Queen Stories","Village Stories","Moral Value Stories","Spiritual Stories","Religious Stories","Ramayana Stories","Mahabharata Stories","Quran Stories","Bible Stories","God Stories","Motivational Real Stories","Success Stories","Failure To Success Stories","Inspirational Biographies","Life Lesson Stories","Science Fiction Stories","Space Stories","Alien Stories","Future Stories","Time Travel Stories","Comedy Stories","Rom-Com Stories","Family Stories","Drama Stories","Emotional Family Stories","Social Message Stories","Women Empowerment Stories","Patriotic Stories","Freedom Stories","Indian Army Stories","Festival Stories","Diwali Stories","Holi Stories","Eid Stories","Christmas Stories","New Year Stories","Adventure Kids Stories","Moral Bedtime Stories","Bedtime Stories For Kids","Short Love Stories","Sad Romantic Stories","Heartbreak Stories","Teenage Stories","College Stories","School Stories","Childhood Stories","Marriage Stories","Couple Stories","Parents Stories","Mother Stories","Father Stories","Brother Sister Stories","Friend Stories","Magic Stories","Witch Stories","Superhero Stories","Fantasy Kingdom Stories","Fictional Stories","Non-Fiction Stories","Modern Stories","Classic Stories","Inspirational Hindi Kahani","Funny Kahani","Prem Kahani","Jeevan Kahani","Anokhi Kahani","Desi Kahani","Emotional Kahani","Motivational Kahani"];
  
const ContentManager = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [database, setDatabase] = useState("jokes");
  const [openDialog, setOpenDialog] = useState(false);
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState(""); // 👈 Logged-in user name
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [writername, setWritername] = useState("");
  const [shayarname, setShayarname] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const contentRef = useRef(null);

  // Fetch items dynamically
  const fetchItems = async () => {
    if (!token) return;
    try {
      const response = await api.get(`/jokes?database=${database}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data || []);
    } catch (error) {
      console.error("Error fetching items:", error.response?.data || error.message);
      setItems([]);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = decryptData(localStorage.getItem("name")) || "Admin";
    if (!storedToken) {
      navigate("/login");
      return;
    }
    setToken(storedToken);
    setUserName(storedUser);
    setPostedBy(storedUser);
  }, [navigate]);

  useEffect(() => {
    if (token) fetchItems();
  }, [token, database]);

  // Load item for edit
  const handleEdit = async (item) => {
    const id = item.id;
    setSelectedId(id);
    if (!token) return;

    try {
      const response = await api.get(`/jokes/${database}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;

      setCategory(data.category || "");
      setPostedBy(data.postedBy || userName);

      if (database === "jokes") {
        setContent(data.joke || "");
        setWritername(data.writername || "");
      } else if (database === "stories") {
        setTitle(data.title || "");
        setWritername(data.writername || "");
        setImage(data.image || "");
        setContent(data.story || "");
      } else if (database === "shayri") {
        setShayarname(data.shayarname || "");
        setTag(data.tag || "");
        setContent(data.shayri || "");
      }

      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching item:", error.response?.data || error.message);
    }
  };

  // Delete item
  const handleDelete = async (item) => {
    const id = item.id;
    if (!token || !id) return;

    try {
      await api.delete(`/jokes/${database}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error.response?.data || error.message);
    }
  };

  // Bold & newline helpers
  const handleBoldClick = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart === selectionEnd) {
      const newText = value.slice(0, selectionStart) + "**bold**" + value.slice(selectionEnd);
      setContent(newText);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
        textarea.focus();
      }, 0);
    } else {
      const selectedText = value.slice(selectionStart, selectionEnd);
      const newText =
        value.slice(0, selectionStart) + `**${selectedText}**` + value.slice(selectionEnd);
      setContent(newText);
      setTimeout(() => {
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionEnd + 4;
        textarea.focus();
      }, 0);
    }
  };

  const handleNewLineClick = () => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value } = textarea;
    const newText = value.slice(0, selectionStart) + "\\n" + value.slice(selectionEnd);
    setContent(newText);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 2;
      textarea.focus();
    }, 0);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const newId = selectedId || uuidv4();
    let payload;

    if (database === "jokes") {
      payload = {
        jokeId: newId,
        category,
        writername,
        jokeText: content,
        postedBy: userName,
      };
    } else if (database === "stories") {
      payload = {
        storyId: newId,
        title,
        writername,
        image,
        story: content,
        postedBy: userName,
      };
    } else if (database === "shayri") {
      payload = {
        shayriId: newId,
        category,
        shayarname,
        tag,
        shayri: content,
        postedBy: userName,
      };
    }

    try {
      if (selectedId) {
        await api.put(`/jokes/${database}/${newId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/jokes/create/${database}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setOpenDialog(false);
      setSelectedId(null);
      fetchItems();
      resetForm();
    } catch (error) {
      console.error("Error saving item:", error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setWritername("");
    setImage("");
    setCategory("");
    setShayarname("");
    setTag("");
    setContent("");
    setPostedBy(userName);
  };
  const getCategoryList = () => {
    if (database === "shayri") return shayariCategories;
    if (database === "stories") return storyCategories;
    return jokesCategories;
  };
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Content Manager
      </Typography>

      <FormControl sx={{ minWidth: 150, mb: 2 }}>
        <InputLabel>Database</InputLabel>
        <Select
          value={database}
          label="Database"
          onChange={(e) => setDatabase(e.target.value)}
        >
          <MenuItem value="jokes">Jokes</MenuItem>
          <MenuItem value="stories">Stories</MenuItem>
          <MenuItem value="shayri">Shayari</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          resetForm();
          setOpenDialog(true);
          setSelectedId(null);
        }}
        sx={{ mb: 2, width: 180 }}
      >
        <AddIcon sx={{ mr: 1 }} /> Create{" "}
        {database === "jokes"
          ? "Joke"
          : database === "stories"
          ? "Story"
          : "Shayari"}
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedId ? "Edit" : "Create"}{" "}
          {database === "jokes"
            ? "Joke"
            : database === "stories"
            ? "Story"
            : "Shayari"}
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
              <Autocomplete
              freeSolo
              options={getCategoryList()}
              value={category}
              onChange={(e, newValue) => setCategory(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="Category" placeholder="Select or add category" fullWidth />
              )}
            />

            {database === "stories" && (
              <>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Writer Name"
                  value={writername}
                  onChange={(e) => setWritername(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  fullWidth
                />
              </>
            )}

            {database === "shayri" && (
              <>
                <TextField
                  label="Shayar Name"
                  value={shayarname}
                  onChange={(e) => setShayarname(e.target.value)}
                  fullWidth
                />
                
                <TextField
                  label="Tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  fullWidth
                />
              </>
            )}

            {database === "jokes" && (
              <TextField
                label="Writer Name"
                value={writername}
                onChange={(e) => setWritername(e.target.value)}
                fullWidth
              />
            )}

            <Stack direction="row" spacing={1}>
              <Tooltip title="Bold">
                <IconButton onClick={handleBoldClick} size="small" color="primary">
                  <FormatBoldIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Line">
                <IconButton
                  onClick={handleNewLineClick}
                  size="small"
                  color="primary"
                >
                  <SubdirectoryArrowLeftIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            <TextField
              label={
                database === "jokes"
                  ? "Joke"
                  : database === "stories"
                  ? "Story"
                  : "Shayari"
              }
              multiline
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              inputRef={contentRef}
              fullWidth
            />

            <Typography variant="subtitle1">Preview:</Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, whiteSpace: "pre-wrap", minHeight: 100 }}
            >
              <ReactMarkdown>{content.replace(/\\n/g, "\n")}</ReactMarkdown>
            </Paper>

            {/* Auto-filled postedBy for all */}
            <TextField
              label="Posted By"
              value={postedBy}
              InputProps={{ readOnly: true }}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* CARD LIST */}
      <Grid container spacing={3}>
        {items.map((item) => {
          const id =
            item.id || item.shayriId || item.jokeId || item.storyId;
          return (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6">{item.category}</Typography>

                  {database === "jokes" && (
                    <>
                      <Typography fontWeight="bold">
                        {item.writername}
                      </Typography>
                      <Typography style={{ whiteSpace: "pre-line" }}>
                        {item.joke}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        🕒 {item.postedBy}
                      </Typography>
                    </>
                  )}

                  {database === "stories" && (
                    <>
                      <Typography fontWeight="bold">{item.title}</Typography>
                      <Typography>By {item.writername}</Typography>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "100%", margin: "10px 0" }}
                        />
                      )}
                      <Typography style={{ whiteSpace: "pre-line" }}>
                        {item.story}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        🕒 {item.postedBy}
                      </Typography>
                    </>
                  )}

                  {database === "shayri" && (
                    <>
                      <Typography fontWeight="bold">
                        {item.shayarname}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        #{item.tag}
                      </Typography>
                      <Typography
                        style={{ whiteSpace: "pre-line", marginTop: 6 }}
                      >
                        {item.shayri}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        🕒 {item.postedBy}
                      </Typography>
                    </>
                  )}

                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(item)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      <EditIcon sx={{ mr: 1 }} /> Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(item)}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ContentManager;
