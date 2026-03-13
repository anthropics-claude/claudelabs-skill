// ClaudeLabs Skill - $CLABS
// AI-powered research and development for Bankr ecosystem

const SKILL_NAME = "ClaudeLabs";
const TICKER = "CLABS";
const { execSync } = require("child_process");

function executeBankrCommand(prompt) {
  try {
    console.log(`[${SKILL_NAME}] Executing Bankr: ${prompt}`);
    const safePrompt = prompt.replace(/"/g, '\\"');
    return execSync(`bankr prompt "${safePrompt}"`, { encoding: "utf-8" });
  } catch (error) {
    return `Error: ${error.message}\n${error.stdout || ""}`;
  }
}

module.exports = {
  name: SKILL_NAME,
  ticker: TICKER,
  version: "1.0.0",

  // Skill initialization
  async init(context) {
    console.log(`[${SKILL_NAME}] Skill initialized`);
    return {
      status: "ready",
      name: SKILL_NAME,
      ticker: TICKER,
    };
  },

  // Main skill handler
  async execute(params, context) {
    const { action, data } = params;
    const query = data?.query || data?.prompt || "";

    switch (action) {
      case "info":
        return {
          name: SKILL_NAME,
          ticker: TICKER,
          description: "AI-powered research and development skill",
          author: "anthropics-claude",
        };

      case "analyze":
        const analysisPrompt = query || "what tokens are trending on base?";
        return {
          status: "success",
          message: `[${SKILL_NAME}] Analysis complete`,
          result: executeBankrCommand(analysisPrompt),
        };

      case "trade":
        if (!query) return { status: "error", message: "Trade query is required (e.g. 'buy $10 of ETH on base')" };
        return {
          status: "success",
          message: `[${SKILL_NAME}] Trade execution complete`,
          result: executeBankrCommand(query),
        };

      case "portfolio":
        try {
          const balances = execSync(`bankr balances --json`, { encoding: "utf-8" });
          return { status: "success", data: JSON.parse(balances) };
        } catch (err) {
          return { status: "error", message: err.message };
        }

      default:
        return {
          status: "error",
          message: `Unknown action: ${action}`,
        };
    }
  },
};
