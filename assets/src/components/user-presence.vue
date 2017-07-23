<template>
  <div>
    <div class="list-label">Online</div>

    <transition-group name="user-presence">
      <div v-for="user in online" :key="user" class="item">
        <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
        <div class="item-content has-secondary">{{user.display_name}}</div>

        <template>
          <i
            v-if="voting && votes.includes(user.id)"
            class="item-secondary"
          >
            done
          </i>

          <template v-else-if="discussion && votes[user.id]">
            <i v-if="votes[user.id] === 'time'" class="item-secondary">
              access_time
            </i>

            <span v-else class="item-secondary">
              {{votes[user.id]}}
            </span>
          </template>
        </template>
      </div>
    </transition-group>

    <hr>

    <div class="list-label">Offline</div>

    <transition-group name="user-presence">
      <div v-for="user in offline" :key="user" class="item">
        <gravatar :email="user.email" :circle="true" class="item-primary"></gravatar>
        <div class="item-content has-secondary">{{user.display_name}}</div>
      </div>
    </transition-group>
  </div>
</template>

<script src="./user-presence.js"></script>
