/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import { DetachedComment } from '../service/comment'
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";

 const style = {
  icon: {
    fontSize: 20,
  },

  inline: {
    display: 'inline',
  },
  username: {
    fontWeight: 500,
    fontSize: 15,
  },
};

interface Props {
  data: DetachedComment,
}

export class Comment extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data;
        return (
            <ListItem key={data.hash} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="avatar"/>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography style={style.username}>
                    {data.author}
                  </Typography>
                }
                secondary={
                    <Typography
                      variant="body2"
                      style={style.inline}
                      color="textPrimary"
                    >
                      {data.text}
                    </Typography>
                }
              />
            </ListItem>
          );
    }
}
