// This page will be used to create new posts
function CreatePost() {
  const [text, setText] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/posts", { text })
       .then(() => {
         setMsg("Posted!");
         setText("");
       })
       .catch((err) => setMsg(err.response?.data?.message || err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Create</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}