const HelpPage = () => {
  const faqs = [
    {
      question: "How do I create a new post?",
      answer:
        "Go to the New Post page by clicking on the link above, from there fill out what you want to say into the text box and click the button marked 'Post'. This will then redirect you to the homepage where you can see your post.",
    },
    {
      question: "Can I edit or delete my posts?",
      answer:
        "Yes! Navigate to your Profile page, click on the button marked 'View My Posts' and on each post you will see two buttons called edit and delete.",
    },
    {
      question: "How do I report a bug or user?",
      answer:
        "You can send us am email at hamimarc@oregonstate.edu with details about the issue or user you want to report. Please include as much information as possible.",
    },
    {
      question: "Are spoilers allowed?",
      answer:
        "Yes game spoilers are allowed, but we ask that you start your post with the word 'Spoiler' so that users can avoid them if they wish.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-700">Help & FAQs</h1>
        <p className="mb-10 text-lg text-gray-300">
          Welcome to PixelHaven Help. Here are some common questions users ask:
        </p>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative"
            >
              <h2 className="text-xl font-semibold text-pink-700">
                {faq.question}
              </h2>
              <p className="mt-2 text-gray-200">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="my-6 space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl text-white relative">
            <h2 className="text-xl font-semibold text-pink-700"> If your question was not answered</h2>
            <p className="mt-2 text-gray-200"> Email us at fakeemail@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
