
async function tighten() {
  const draft = document.getElementById("draft").value;
  const post = document.getElementById("post").value;
  const stance = document.getElementById("stance").value;
  const output = document.getElementById("output");

  if (!draft.trim() || !post.trim()) {
    output.innerText = "Please enter both the post and your draft.";
    return;
  }

  output.innerText = "Refining comment...";

  try {
    const res = await fetch("/api/refine-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft, stance, post }),
    });
    const data = await res.json();
    output.innerText = data.refined || "No refined comment returned.";
  } catch (err) {
    output.innerText = "Error refining comment.";
    console.error(err);
  }
}
