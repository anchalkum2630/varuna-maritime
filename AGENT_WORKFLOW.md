# AI Agent Workflow Log

## Agents Used
- **ChatGPT** – helped understand functionality, provided guidance on domain logic and formulas. 
- **Gemini** – assisted in writing boilerplate code for backend and frontend components. 
- **GitHub Copilot** – used for inline code completions, generating repetitive TypeScript functions and React components.

---

## Prompts & Outputs

**Example 1: Compliance Balance (CB) Function**
* **Prompt:** "Write a TypeScript function to compute Compliance Balance (CB) using target intensity, actual intensity, and fuel consumption." 
* **Output from ChatGPT/Gemini:**
    ```ts
    const computeCB = (target: number, actual: number, fuelConsumption: number) => {
        const energyMJ = fuelConsumption * 41000;
        return (target - actual) * energyMJ;
    };
    ```
* **Usage:** Directly used this function with minor type adjustments for strict TS compliance.

**Example 2: React Table Component**
* **Prompt:** "Generate a React table component with filters for vessel type, fuel type, and year, displaying all routes."
* **Output:**
    ```tsx
    const RoutesTable = ({ routes }) => (
        <table>
            <thead>
                <tr>
                    <th>Route ID</th><th>Vessel Type</th><th>Fuel Type</th><th>Year</th>
                </tr>
            </thead>
            <tbody>
                {routes.map(route => (
                    <tr key={route.id}>
                        <td>{route.routeId}</td>
                        <td>{route.vesselType}</td>
                        <td>{route.fuelType}</td>
                        <td>{route.year}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    ```
* **Usage:** Refined this snippet to include error handling for empty datasets, fixed filter logic, and added TailwindCSS styling.

---

## Validation / Corrections

* **CORS Issue:** Initially used wrong origin in backend headers (**localhost:5173** vs **localhost:5174**). Corrected it to match the frontend origin.
* **SQL Syntax:** AI-generated SQL for filtering had minor mistakes; corrected column references and **WHERE** clauses.
* **Error Handling:** Enhanced AI boilerplate with **try/catch** and API error messages.
* **Verification:** Verified formulas manually with sample data to ensure CB and comparison calculations were correct.
* **Testing:** Tested frontend filtering and baseline POST operations in the browser.

---

## Observations

* AI agents saved significant time writing **boilerplate code** and repetitive TS/React structures.
* Error handling sections were much faster to implement with AI suggestions.
* AI occasionally **hallucinated SQL syntax and backend logic**; needed manual verification.
* Combining **ChatGPT for logic explanation** and **Gemini/Copilot for code generation** worked efficiently.

---

## Best Practices Followed

* Used AI to **understand and plan functionality** before writing code.
* Copilot for **inline completions** and repetitive boilerplate.
* **Manual testing and corrections** for SQL queries, CORS headers, and error handling.
* Ensured **strict TypeScript compliance** and separation of concerns following hexagonal architecture.