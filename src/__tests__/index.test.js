'use strict';

import pkg from '../index';
import React from 'react';
import renderer from 'react-test-renderer';

/**
 * Jest provides an easy way to test React components using a technique called
 * snapshots. Here's a simple example:
 *
 * test('SomeComponent with some props', () => {
 *     const component = renderer.create(
 *         <SomeComponent
 *             name="beautiful component",
 *             className="beautiful-class"
 *         />
 *     );
 *     expect(component.toJSON()).toMatchSnapshot();
 * });
 *
 * The next time you run the tests, the rendered output will be compared to the
 * previously created snapshot. The snapshot should be committed along code
 * changes. When a snapshot test fails, you need to inspect whether it is an
 * intended or unintended change. If the change is expected you can invoke Jest
 * with jest -u to overwrite the existing snapshot.
 *
 * Refer to https://facebook.github.io/jest/docs/tutorial-react.html for
 * additional information
 */

/* See more at https://facebook.github.io/jest/docs/api.html */

test('should pass', () => {
    expect(true).toBe(true);
});
