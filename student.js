const axios = require('axios');
const { Client } = require('pg');

// Provided access token
const accessToken = 'AAIgMjg5OWEwNDJjODNjMzA4MGFjZDFiZDY4MTQxNDY0YjIXxfK_x7TApZo-N-FBdY6j_RUNzzDo1eHS5VJtEoZ4j2lmArqkJCw1SpBUb1bxL4W9yZgiqaGExCEGZVAj_b--dgzwpVcdcwoXW0AvY8UL2g';

// Function to fetch data from the API
async function fetchDataFromAPI(locationCode) {
    try {
        const response = await axios.get('https://api.schools.nyc/doe/prd/v1/courses/current-grades-search', {
            params: { locationCode },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                serviceAccountID: 'service.SolvCon'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error.response.data);
        return null;
    }
}

// Function to insert data into the PostgreSQL table
async function insertDataIntoPostgres(data) {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'A123@123',
        port: 5432 // Default PostgreSQL port
    });

    try {
        await client.connect();

        for (const item of data.item) {
            for (const school of item.schools) {
                const { schoolDBN, courses } = school;

                for (const course of courses) {
                    const { id: courseid, courseCode, schoolYear, termID, sections } = course;

                    for (const section of sections) {
                        const { id: sectionID, markingPeriodGrades } = section;

                        for (const grade of markingPeriodGrades) {
                            const { credits, markingPeriod } = grade;

                            const query = {
                                text: `INSERT INTO student_grades (schoolDBN, courseCode, courseid, schoolYear, termID, sectionID, markingPeriod, credits) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
                                values: [

                                    schoolDBN,
                                    courseCode,
                                    courseid,
                                    schoolYear,
                                    termID,
                                    sectionID,
                                    markingPeriod,
                                    credits
                                ],
                            };
                            await client.query(query);
                        }
                    }
                }
            }
        }

        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data into PostgreSQL:', error);
    } finally {
        await client.end();
    }
}

// Main function to orchestrate the process
async function main() {
    const locationCode = '29Q116'; // Replace with the desired location code
    const data = await fetchDataFromAPI(locationCode);

    if (data && data.item && Array.isArray(data.item)) {
        await insertDataIntoPostgres(data);
    } else {
        console.error('Data from API is not in the expected format:', data);
    }
}

main();
