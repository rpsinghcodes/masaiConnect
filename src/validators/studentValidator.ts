import { body } from 'express-validator';
import mongoose from 'mongoose';

const isValidObjectId = (value: string) => mongoose.Types.ObjectId.isValid(value);

export const studentValidator = [
    body('studentCode')
        .trim()
        .notEmpty()
        .withMessage('Student code is required.')
        .isString()
        .withMessage('Student code must be a string.'),

    body('subRole')
        .optional()
        .isArray()
        .withMessage('SubRole must be an array.')
        .custom((roles: string[]) => {
            const subRoles = ['student', 'alumni', 'senior-alumni', 'contributor'];
            return roles.every((role) => subRoles.includes(role));
        })
        .withMessage("Invalid subRole. Must be one of ['student', 'alumni', 'senior-alumni', 'contributor']."),

    body('enrolledCourses')
        .optional()
        .isArray()
        .withMessage('Enrolled courses must be an array.')
        .custom((courses: string[]) => courses.every(isValidObjectId))
        .withMessage('Invalid course ID in enrolledCourses.'),

    body('currentCourses')
        .optional()
        .isArray()
        .withMessage('Current courses must be an array.')
        .custom((courses: string[]) => courses.every(isValidObjectId))
        .withMessage('Invalid course ID in currentCourses.'),

    body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array.')
        .custom((skills: string[]) => skills.every((skill) => typeof skill === 'string'))
        .withMessage('Each skill must be a string.'),

    body('bookedSessions')
        .optional()
        .isArray()
        .withMessage('Booked sessions must be an array.')
        .custom((sessions: string[]) => sessions.every(isValidObjectId))
        .withMessage('Invalid session ID in bookedSessions.'),

    body('educationDetails')
        .optional()
        .isArray()
        .withMessage('Education details must be an array.')
        .custom((educationList) => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            return educationList.every((edu: any) => {
                return (
                    typeof edu.collegeName === 'string' &&
                    typeof edu.degree === 'string' &&
                    !isNaN(Date.parse(edu.startDate)) &&
                    (edu.endDate === null || !isNaN(Date.parse(edu.endDate)))
                );
            });
        })
        .withMessage('Invalid education details. Ensure correct format.'),

    body('pastExperience')
        .optional()
        .isArray()
        .withMessage('Past experience must be an array.')
        .custom((experienceList) => {
            return experienceList.every(
                (exp: {
                    organisationName: string;
                    jobTitle: string;
                    areaOfResponsibility: string;
                    startDate: string;
                    endDate: string | null;
                }) => {
                    return (
                        typeof exp.organisationName === 'string' &&
                        typeof exp.jobTitle === 'string' &&
                        typeof exp.areaOfResponsibility === 'string' &&
                        !isNaN(Date.parse(exp.startDate)) &&
                        (exp.endDate === null || !isNaN(Date.parse(exp.endDate)))
                    );
                }
            );
        })
        .withMessage('Invalid past experience. Ensure correct format.'),
];
