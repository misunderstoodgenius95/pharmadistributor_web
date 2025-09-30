

const users = new Map([
    ['user1', { name: 'Alice', age: 30, city: 'New York' }],
    ['user2', { name: 'Bob', age: 25, city: 'London' }],
    ['user3', { name: 'Charlie', age: 30, city: 'Paris' }],
    ['user4', { name: 'Diana', age: 35, city: 'Tokyo' }]
]);

const filteredStream = new ReadableStream({
    start(controller) {
        for (const [key, value] of users) {
            if (value.age === 30) {
                controller.enqueue({ key, ...value });
            }
        }
        controller.close();
    }
});

// Read the filtered results
async function readFilteredResults() {
    const reader = filteredStream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log('User with age 30:', value);
    }
}

readFilteredResults();

