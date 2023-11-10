export const translateText = async (quiz, language) => {
  try {
    const response = await fetch(
      `https://quiz-app-react-express-production-f12f.up.railway.app/api/v2/quiz/translate?lan=${language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      }
    );
    if (response.ok) {
      const json = await response.json();
      return { ok: true, data: json };
    } else {
      return { message: "Quiz translate failed" };
    }
  } catch (error) {
    return {
      message: "Quiz translate failed, the server not responding.",
    };
  }
};
