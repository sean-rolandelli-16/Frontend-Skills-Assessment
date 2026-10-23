The first commit was what I accomplished within the sugusted 2 hours.

I came back to implement the final tasks at a seperate time.


**What I changed and why:**
Added pagination that takes, page, pageSize, and search parameters and returns transactions, total, page, and pageSize
- This was done to stop all transactions from loading on the page at once

I moved the search filter from the frontend to the backend
- This was done so the search worked on all transactions, not just the paginated results in the frontend
- added a debounce so the api is not overrun from requests every time someone enters a key, especially useful if they are typing fast

I fixed the total processed, which I explain in the task 2 bug section.

New transaction form
- there needs to be surcharge changes, as it is 0 when a new transaction is added. I used a example percentage
- added the surcharge to the total
- added data validation to the frontend and backend
- changed layout to a form compoent for easier data validation

Transaction Detail Page
- made a new route in App.tsx
- detail page is navigated to when a transaction is clicked
- uses the same detail layout that was a popup before

General Changes
- changed transaction list to use links so they are able to be accessed by keyboard

**Task 2 bug:**
The total added up the amount for every status, so declined, pending, refunded and voided transactions inflated. After pagination it was also adding up only the current page. I fixed getSummary on the server side to ignore all but approved transactions, and once pagination was implemented I changed it so the amount is for all transaction that fit the search criteria and not only the paginated ones.


**Task 5 write-up:**
- There should be security on who can add new transactions. While this is a sample setup, it should be based on what role the user has. As an example, a admin could add transactions, but a regular user/employee might only be able to read the transactions and not add any.
- Types are duplicated across the api and web folders. They should be moved into a shared package or folder to stop any type disagreements.
- There is a lack of accessibility options for users. Transaction rows can not be accessed with just a keyboard and the table itself would not be read properly from a screen reader since it is a group of divs that would be a long line of text. (I went back and fixed this)


**Short Questions:**
1. When a keystroke happens, the search parameter is updated. With the updated search parameter, the api is called with the page and pageSize values as well. The backend then filters throught the data using the search paramter, and saves that as a new set of data. With the new filtered data, it sends that back to the frontend sliced into pageSize chunks that can be displayed in pages. It also sends back the total number of transactions being sent. In addition to that, a summary api call happens that calculates the summary heading information using the same search parameters, but it uses the whole transaction field and not just the small paginated transactions. For performance this would become an issue if the pageSize was dramatically increased, or the site was reloaded / remounted to often.
2. I decided to put most of the pagination in the server. When connecting to a real database, it is faster to do filtering queries in the initial query itself as apposed to doing it in the frontend. Additionally, it keeps the frontend code simpiler since all of the calculations happen in the backend and all the frontend needs to focus on is displaying the values. If it grew to 10 million rows, it would need to be moved to a database as it would most likely crash trying to use readFileSync for that much data. Smaller UI changes would be having the page numbers as next or previous, since having 1000+ pages would clutter the screen. Also stop the search from firing until more than 3 characters are entered so one letter doesnt return millions of rows.
3. The first thing I would refuse to ship as-is is the config.ts file in the api folder. It has api keys and secrets available to see. This would be fixed by using a secrets keeper that injects the secrets at deploy time.


**What I would do with more time:**
General Changes
- add better filtering options other than just a search bar
- as an example, be able to filter by status and merchant at the same time
- other filter example is being able to see multiple card types at once, so I could potentialy only see VISA and AMEX transactions
- more summary details, maybe I want to see how many pending or refunded transactions there are at a glance instead of having to filter for them