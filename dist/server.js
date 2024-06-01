import createApp from "./app.js";
const app = createApp();
// server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
export default app;
