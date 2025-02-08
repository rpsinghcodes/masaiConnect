linkedin profile url ==> user schema

student gaurdian details
resume link
login activity

student session book=> 3 possible ia, 2 mentors,

/api/v1/auth/register
/api/v1/student/profile-setup

Student onboarding
post > /student/profile-setup
Request: stdCode, current courses
Response: true false

get > /student/get-mentors couses
Request: course
Response: mentors list [name, slots]

post> /student/session-request
Request: mentorId, courseId, slot, title, description, isSolo
Response: true false

get > /student/get-past-session  
get > /student/get-present-session
get > /student/get-future-session

Mentor onboarding

post> /mentor/profile-setup
Request: mentorId, current courses
Response: true false

post> /mentor/get-requested-sessions
Request: mentorId
Response: requested sessions details

get> /mentor/get-past-session
get> /mentor/get-present-session  
get> /mentor/get-future-session

get mentors by course
